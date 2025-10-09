import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import apiRoutes from "../routes/index.js";
import cookieParser from "cookie-parser";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRoutes);

app.use(express.static(path.join(__dirname, "../../client/build")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

export default app;
