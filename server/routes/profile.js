import express from "express";
import profileController from "../controllers/profileController.js";
const router = express.Router();
import { requireAuth } from "../middleware/tokenchecker.js";

router.post("/changeInfo", requireAuth(), profileController.changeInfoPersonal);

export default router;
