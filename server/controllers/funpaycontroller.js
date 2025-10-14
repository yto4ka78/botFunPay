import { sequelize } from "../models/index.js";
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
        console.log("User in addaccount not found");
        return res.status(400);
      }
      const funpayaccount = await sequelize.models.FunpayAccount.create({
        userId: user.id,
        funpayEmail: funpayEmail,
        goldenKey: goldenKey,
      });
      return res.status(200).json({ success: true, message: "Account added" });
    } catch (error) {
      console.error("Error in addaccount " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }
}
export default funpaycontroller;
