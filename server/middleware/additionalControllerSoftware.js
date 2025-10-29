import { sequelize } from "../models/index.js";

class additionalControllerSoftware {
  static async checkServiceAndAccountInUse(poolAccounts, poolServices) {
    try {
      for (const account of poolAccounts) {
        const accountCheck = await sequelize.models.PoolSteamAccount.findOne({
          where: {
            steamAccountId: account.id,
          },
        });
        if (accountCheck) {
          return {
            success: false,
            message: `Account ${account.steamLogin} already in use`,
          };
        }
      }

      for (const service of poolServices) {
        const serviceCheck = await sequelize.models.Service.findOne({
          where: {
            id: service.id,
          },
        });

        if (serviceCheck.poolId) {
          return {
            success: false,
            message: `Service ${service.name} already in use`,
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error in checkServiceAndAccountInUse " + error);
      return { success: false, message: "Error server" };
    }
  }

  static async createPoolData(pool, poolAccounts, poolServices) {
    try {
      for (const account of poolAccounts) {
        await sequelize.models.PoolSteamAccount.create({
          poolId: pool.id,
          steamAccountId: account.id,
          inUse: false,
        });
      }
      for (const service of poolServices) {
        const serviceModel = await sequelize.models.Service.findOne({
          where: {
            id: service.id,
          },
        });
        serviceModel.poolId = pool.id;
        await serviceModel.save();
      }

      return { success: true };
    } catch (error) {
      console.error("Error in checkAndCreateAccount " + error);
      return { success: false, message: "Error server" };
    }
  }
}
export default additionalControllerSoftware;
