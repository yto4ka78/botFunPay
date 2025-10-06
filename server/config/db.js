import { sequelize, initModels } from "../models/index.js";

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
  await initModels();
  console.log("Models:", Object.keys(sequelize.models));
  if (process.env.NODE_ENV === "dev") {
    sequelize
      .sync({ force: true })
      .then(() => {
        console.log("All models were synchronized successfully and forced.");
      })
      .catch((error) => {
        console.error("Error synchronizing models:", error.message);
      });
  } else {
    sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("All models were synchronized successfully.");
      })
      .catch((error) => {
        console.error("Error synchronizing models:", error.message);
      });
  }
};

export default { sequelize, connectDB, syncBD };
