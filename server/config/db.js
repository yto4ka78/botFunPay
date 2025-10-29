import { sequelize, initModels } from "../models/index.js";

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected...");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export const syncDB = async () => {
  await initModels();
  console.log("Models:", Object.keys(sequelize.models));
  // if (process.env.NODE_ENV === "dev") {
  //   sequelize
  //     .sync({ alter: true })
  //     .then(() => {
  //       console.log("All models were synchronized successfully and forced.");
  //     })
  //     .catch((error) => {
  //       console.error("Error synchronizing models:", error.message);
  //     });
  // } else {
  //   sequelize
  //     .sync({ alter: true })
  //     .then(() => {
  //       console.log("All models were synchronized successfully.");
  //     })
  //     .catch((error) => {
  //       console.error("Error synchronizing models:", error.message);
  //     });
  // }
};

export default { sequelize, connectDB, syncDB };
