import { sequelize } from "../models/index.js";

class additionalControllerSoftware {
  static async checkServiceAndAccountInUse(poolAccounts, poolServices) {
    try {
      const checkPoolAccounts = await sequelize.models.PoolSteamAccount.findAll(
        {
          where: {
            steamAccountId: {
              $in: poolAccounts.map((account) => account.id),
            },
          },
        }
      );
      if (checkPoolAccounts && checkPoolAccounts.length > 0) {
        return { success: false, message: "Some accounts already in use" };
      }
      const checkPoolServices = await sequelize.models.Service.findAll({
        where: {
          idInFunpay: {
            $in: poolServices.map((service) => service.id),
          },
        },
      });
      if (checkPoolServices && checkPoolServices.length > 0) {
        return { success: false, message: "Some services already in use" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in checkServiceAndAccountInUse " + error);
      return { success: false, message: "Error server" };
    }
  }
}
export default additionalControllerSoftware;
