import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected...");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

const syncBD = async () => {
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("All models were synchronized successfully.");
    })
    .catch((error) => {
      console.error("Error synchronizing models:", error.message);
    });
};

export default { sequelize, connectDB, syncBD };
