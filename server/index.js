import app from "./config/appConfig.js";
import dotenv from "dotenv";
import db from "./config/db.js";
import { Api } from "funpay-js-api";
dotenv.config();

db.connectDB();
db.syncBD();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`http://localhost:${port}`));

// const goldenKey = process.env.FUNPAY_GOLDEN_KEY;
// (async () => {
//   await Api.setConfig(goldenKey);
//   const orders = await Api.getNewOrders();
//   console.log("Новые заказы:", orders);
// })().catch(console.error);
