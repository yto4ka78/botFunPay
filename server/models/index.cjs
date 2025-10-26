// Этот файл используется только Sequelize CLI для миграций
// Модели загружаются через index.js в runtime приложения
const path = require("path");
const Sequelize = require("sequelize");
const config = require(path.resolve(__dirname, "..", "config", "config.cjs"));

const env = process.env.NODE_ENV || "development";
const cfg = config[env];

const sequelize = cfg.use_env_variable
  ? new Sequelize(process.env[cfg.use_env_variable], cfg)
  : new Sequelize(cfg);

module.exports = {
  sequelize,
  Sequelize,
};
