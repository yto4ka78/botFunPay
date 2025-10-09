import express from "express";
import authControllers from "../controllers/authControllers.js";
const router = express.Router();

router.post("/registration", authControllers.registration);
router.get("/verify/:token", authControllers.confirmationEmail);
router.post("/login", authControllers.login);
router.get("/refresh", authControllers.refreshAccessToken);

export default router;
