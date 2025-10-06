import express from "express";
import authControllers from "../controllers/authControllers.js";
const router = express.Router();

router.post("/registration", authControllers.registration);

export default router;
