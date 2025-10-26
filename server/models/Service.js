import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Service extends Model {
    static associate(models) {
      this.belongsTo(models.Pool, {
        as: "pool",
        foreignKey: { name: "poolId", allowNull: false },
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
        allowNull: false,
      },
      idInFunpay: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
