import express from "express";
import auth from "./auth.js";
import funpay from "./funpay.js";
const router = express.Router();

router.use("/auth", auth);
router.use("/funpay", funpay);

export default router;
