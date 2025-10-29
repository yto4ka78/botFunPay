import { sequelize } from "../models/index.js";
import { bot } from "../middleware/axios.js";
import additionalControllerSoftware from "../middleware/additionalControllerSoftware.js";

class funpaycontroller {
  static async addaccount(req, res) {
    try {
      const { goldenKey, funpayName } = req.body;

      if (!goldenKey) {
        return res
          .status(400)
          .json({ success: false, message: "Golden key is required" });
      }

      const user = await sequelize.models.User.findByPk(req.user.id, {
        where: { id: req.user.id },
      });

      if (!user) {
        console.error("User in addaccount not found");
        return res
          .status(400)
          .json({ success: false, message: "Login to FunPay and try again" });
      }

      const userAccounts = await sequelize.models.FunpayAccount.findAll({
        where: { userId: user.id },
      });

      // Проверяем, есть ли уже такой goldenKey (сравниваем расшифрованные)
      for (const acc of userAccounts) {
        const decryptedKey = acc.getDecryptedGoldenKey();
        if (decryptedKey === goldenKey) {
          return res
            .status(400)
            .json({ success: false, message: "This account is already added" });
        }
      }

      const funpayaccount = await sequelize.models.FunpayAccount.create({
        userId: user.id,
        funpayName: funpayName,
        goldenKey: goldenKey,
      });

      // try {
      //   const response = await bot.post(`/funpay/creatAcc/${goldenKey}`);
      // } catch (botError) {
      //   console.error("Bot API error:", botError.message);
      // }

      return res
        .status(200)
        .json({ success: true, message: "Account added successfully" });
    } catch (error) {
      console.error("Error in addaccount " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }

  static async getOffers(req, res) {
    try {
      const { id } = req.params;
      const account = await sequelize.models.FunpayAccount.findOne({
        where: {
          id: id,
        },
      });
      if (!account) {
        return res
          .status(404)
          .json({ success: false, message: "Account not found" });
      }
      if (account.userId !== req.user.id) {
        return res
          .status(400)
          .json({ success: false, message: "Not you account" });
      }
      const goldenKey = account.getDecryptedGoldenKey();
      const { data } = await bot.get(`/funpay/getOffers/${goldenKey}`);
      const payload = Array.isArray(data?.services)
        ? data.services
        : data?.services
        ? [data.services]
        : Array.isArray(data)
        ? data
        : [data];

      if (payload.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "You don't have services" });
      }

      return res.status(200).json({ success: true, services: payload });
    } catch (error) {
      console.error("Get user controller error " + error);
      return res
        .status(500)
        .json({ success: false, message: "Internal error" });
    }
  }

  static async addService(req, res) {
    try {
      const { funpayAccountId, idInFunpay, name, price, rentalTime } = req.body;

      if (!funpayAccountId || !idInFunpay || !name || price === undefined) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: funpayAccountId, idInFunpay, name, price",
        });
      }

      // Преобразуем price в число
      const priceFloat = parseFloat(price);
      if (isNaN(priceFloat) || priceFloat < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid price value. Must be a positive number.",
        });
      }

      // Проверяем, существует ли уже такой сервис для данного аккаунта
      const existingService = await sequelize.models.Service.findOne({
        where: {
          idInFunpay: idInFunpay,
          funpayAccountId: funpayAccountId,
        },
      });

      if (existingService) {
        return res.status(400).json({
          success: false,
          message: "Service already initialized for this account",
        });
      }

      const service = await sequelize.models.Service.create({
        funpayAccountId: funpayAccountId,
        idInFunpay: idInFunpay,
        name: name,
        price: priceFloat,
        rentalTime: rentalTime ? parseInt(rentalTime) : null,
      });

      return res.status(200).json({
        success: true,
        message: "Service initialized successfully",
        service: service,
      });
    } catch (error) {
      console.error("Error in addService:", error);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  }
  static async getInitializedServices(req, res) {
    try {
      const { id } = req.params;
      const services = await sequelize.models.Service.findAll({
        where: {
          funpayAccountId: id,
        },
      });

      return res.status(200).json({
        success: true,
        services: services,
        message: `Found ${services.length} initialized services`,
      });
    } catch (error) {
      console.error("Error in getInitializedServices:", error);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  }
  static async createPool(req, res) {
    try {
      const { poolAccounts, poolServices, funpayAccountId, namePool } =
        req.body;
      const check =
        await additionalControllerSoftware.checkServiceAndAccountInUse(
          poolAccounts,
          poolServices
        );
      if (!check.success) {
        return res.status(400).json(check);
      }
      const pool = await sequelize.models.Pool.create({
        userId: req.user.id,
        funpayAccountId: funpayAccountId,
        name: namePool,
        status: "inactive",
      });
      const checkAndCreateAccount =
        await additionalControllerSoftware.createPoolData(
          pool,
          poolAccounts,
          poolServices
        );
      if (!checkAndCreateAccount.success) {
        await pool.destroy();
        return res.status(400).json(checkAndCreateAccount);
      }

      await pool.save();
      return res.status(200).json({ success: true, message: "Pool created" });
    } catch (error) {
      console.error("Error in createPool " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }
}
export default funpaycontroller;
