import { Model, DataTypes } from "sequelize";
import { decryptGCM } from "../middleware/crypto.js";

export default (sequelize) => {
  class SteamAccount extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.PoolSteamAccount, {
        as: "poolSteamAccounts",
        foreignKey: { name: "steamAccountId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
    getDecryptedAccessToken() {
      if (!this.access_token) return null;
      try {
        return decryptGCM(this.access_token);
      } catch (error) {
        // Если токен не зашифрован (старая запись), возвращаем как есть
        console.warn("Access token не зашифрован:", error.message);
        return this.access_token;
      }
    }
    getDecryptedRefreshToken() {
      if (!this.refresh_token) return null;
      try {
        return decryptGCM(this.refresh_token);
      } catch (error) {
        // Если токен не зашифрован (старая запись), возвращаем как есть
        console.warn("Refresh token не зашифрован:", error.message);
        return this.refresh_token;
      }
    }
    getDecryptedSteamPassword() {
      if (!this.steamPassword) return null;
      try {
        return decryptGCM(this.steamPassword);
      } catch (error) {
        // Если пароль не зашифрован (старая запись), возвращаем как есть
        console.warn("Steam password не зашифрован:", error.message);
        return this.steamPassword;
      }
    }
  }

  SteamAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      steamLogin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      steamPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      game: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      steam_refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      steam_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SteamAccount",
      tableName: "steam_accounts",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );
  return SteamAccount;
};
