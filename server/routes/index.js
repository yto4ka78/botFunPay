import express from "express";
import auth from "./auth.js";
import funpay from "./funpay.js";
import profile from "./profile.js";
import steam from "./steam.js";
const router = express.Router();

router.use("/auth", auth);
router.use("/funpay", funpay);
router.use("/profile", profile);
router.use("/steam", steam);
export default router;
