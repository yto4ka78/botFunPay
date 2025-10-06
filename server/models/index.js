import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize(
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

export const initModels = async () => {
  const db = {};
  const files = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file !== "index.js" &&
        file.endsWith(".js") &&
        !file.endsWith(".test.js")
    );

  for (const file of files) {
    const absPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(absPath).href;
    const { default: factory } = await import(fileUrl);
    const model = factory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
  Object.values(db).forEach((model) => {
    if (typeof model.associate === "function") model.associate(db);
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
};

export default { sequelize, initModels };
