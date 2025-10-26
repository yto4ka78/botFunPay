import express from "express";
import funpaycontroller from "../controllers/funpaycontroller.js";
const router = express.Router();
import { requireAuth } from "../middleware/tokenchecker.js";

router.post("/addaccount", requireAuth(), funpaycontroller.addaccount);
router.get("/getoffers/:id", requireAuth(), funpaycontroller.getOffers);
router.post("/createpool", requireAuth(), funpaycontroller.createPool);

export default router;
