import { DataTypes, Model } from "sequelize";
import { encryptGCM, decryptGCM, isGcmEnvelope } from "../middleware/crypto.js";

export default (sequelize) => {
  class FunpayAccount extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: { name: "userId", allowNull: false },
      });
    }
    getDecryptedGoldenKey() {
      if (!this.goldenKey) return null;
      return decryptGCM(this.goldenKey);
    }
  }

  FunpayAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      funpayName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      funpayEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      goldenKey: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FunpayAccount",
      tableName: "funpay_accounts",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );

  FunpayAccount.beforeCreate((account) => {
    if (account.goldenKey && !isGcmEnvelope(account.goldenKey)) {
      account.goldenKey = encryptGCM(account.goldenKey);
    }
  });

  FunpayAccount.beforeUpdate((account) => {
    if (account.changed("goldenKey")) {
      const value = account.getDataValue("goldenKey");
      if (value && !isGcmEnvelope(value)) {
        account.setDataValue("goldenKey", encryptGCM(value));
      }
    }
  });

  return FunpayAccount;
};
