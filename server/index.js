import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Api } from "funpay-js-api";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const goldenKey = process.env.FUNPAY_GOLDEN_KEY;
(async () => {
  await Api.setConfig(goldenKey);
  const orders = await Api.getNewOrders();
  console.log("Новые заказы:", orders);
})().catch(console.error);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`http://localhost:${port}`));
