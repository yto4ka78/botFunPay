import express from "express";
import steamController from "../controllers/steamController.js";
const router = express.Router();
import { requireAuth } from "../middleware/tokenchecker.js";

router.post("/addGmailAccount", requireAuth(), steamController.addGmailAccount);
router.post("/google", requireAuth(), steamController.google);
router.post(
  "/addMailRuAccount",
  requireAuth(),
  steamController.addMailRuAccount
);
router.get("/getaccounts", requireAuth(), steamController.getSteamAccounts);
export default router;
