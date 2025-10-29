import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Service extends Model {
    static associate(models) {
      this.belongsTo(models.Pool, {
        as: "pool",
        foreignKey: { name: "poolId", allowNull: true },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.FunpayAccount, {
        as: "funpayAccount",
        foreignKey: { name: "funpayAccountId", allowNull: true },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      poolId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      funpayAccountId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      idInFunpay: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rentalTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue("price");
          return value ? parseFloat(value) : 0;
        },
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
      modelName: "Service",
      tableName: "services",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );
  return Service;
};
