import express from "express";
import authControllers from "../controllers/authControllers";
const router = express.Router();

router.post("/registration", authControllers.registration);

export default router;
