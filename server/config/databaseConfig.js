export const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: { max: 5, min: 0, acquire: 20000, idle: 5000 },
  logging: false,
};
