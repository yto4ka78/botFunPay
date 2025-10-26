import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Pool extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.FunpayAccount, {
        as: "funpayAccount",
        foreignKey: { name: "funpayAccountId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Service, {
        as: "services",
        foreignKey: { name: "poolId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.PoolSteamAccount, {
        as: "poolSteamAccounts",
        foreignKey: { name: "poolId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Pool.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      funpayAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "Pool",
      tableName: "pools",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );
  return Pool;
};
