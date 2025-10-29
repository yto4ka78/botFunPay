import express from "express";
import funpaycontroller from "../controllers/funpaycontroller.js";
const router = express.Router();
import { requireAuth } from "../middleware/tokenchecker.js";

router.post(
  "/addaccount",
  requireAuth({ checkCsrf: false }),
  funpaycontroller.addaccount
);
router.get("/getoffers/:id", requireAuth(), funpaycontroller.getOffers);
router.post("/createpool", requireAuth(), funpaycontroller.createPool);
router.post("/addservice", requireAuth(), funpaycontroller.addService);
router.get(
  "/getInitializedServices/:id",
  requireAuth(),
  funpaycontroller.getInitializedServices
);
export default router;
