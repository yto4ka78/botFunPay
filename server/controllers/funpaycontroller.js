import { sequelize } from "../models/index.js";
import { bot } from "../middleware/axios.js";
import additionalControllerSoftware from "../middleware/additionalControllerSoftware.js";
class funpaycontroller {
  static async addaccount(req, res) {
    try {
      const { goldenKey, funpayEmail } = req.body;
      const account = await sequelize.models.FunpayAccount.findByPk(
        funpayEmail,
        {
          attributes: ["funpayEmail"],
        }
      );
      if (account) {
        return res
          .status(400)
          .json({ success: false, message: "This account is added" });
      }
      const user = await sequelize.models.User.findByPk(req.user.id, {
        attributes: ["id", "email", "roles"],
      });
      if (!user) {
        console.error("User in addaccount not found");
        return res.status(400);
      }
      const funpayaccount = await sequelize.models.FunpayAccount.create({
        userId: user.id,
        funpayEmail: funpayEmail,
        goldenKey: goldenKey,
      });
      const response = await bot.post(`/funpay/creatAcc${goldenKey}`);
      return res.status(200).json({ success: true, message: "Account added" });
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
      for (const account of poolAccounts) {
        await sequelize.models.PoolSteamAccount.create({
          poolId: pool.id,
          steamAccountId: account.id,
          inUse: false,
        });
      }
      for (const service of poolServices) {
        await sequelize.models.Service.create({
          poolId: pool.id,
          idInFunpay: service.id,
          name: service.name,
          price: service.price,
          isActive: true,
        });
      }
      return res.status(200).json({ success: true, message: "Pool created" });
    } catch (error) {
      console.error("Error in createPool " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }
}
export default funpaycontroller;
