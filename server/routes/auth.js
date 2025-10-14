import express from "express";
import authControllers from "../controllers/authControllers.js";
const router = express.Router();
import { requireAuth } from "../middleware/tokenchecker.js";

router.post("/registration", authControllers.registration);
router.get("/verify/:token", authControllers.confirmationEmail);
router.post("/login", authControllers.login);
router.get("/refresh", authControllers.refreshAccessToken);
router.get("/me", requireAuth(), authControllers.getUser);
router.post("/logout", requireAuth(), authControllers.logout);

export default router;
