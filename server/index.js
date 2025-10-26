import "dotenv/config";
import app from "./config/appConfig.js";
import db from "./config/db.js";
import { Api } from "funpay-js-api";

db.connectDB();
db.syncDB();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`http://${process.env.IP_SERVER}:${port}`));
