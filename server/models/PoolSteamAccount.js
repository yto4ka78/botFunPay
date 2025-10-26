import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class PoolSteamAccount extends Model {
    static associate(models) {
      this.belongsTo(models.Pool, {
        as: "pool",
        foreignKey: { name: "poolId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.SteamAccount, {
        as: "steamAccount",
        foreignKey: { name: "steamAccountId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  PoolSteamAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      poolId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      steamAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      inUse: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PoolSteamAccount",
      tableName: "pool_steam_accounts",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );

  return PoolSteamAccount;
};
