import { sequelize } from "../models/index.js";
import { getTokensFromCode, getUserInfo } from "../middleware/googleapi.js";
import { oauth2url } from "../middleware/googleapi.js";
import crypto from "crypto";
import { encryptGCM, decryptGCM } from "../middleware/crypto.js";
import { firstLogin } from "../middleware/getSteamToken.js";
class steamController {
  static async addGmailAccount(req, res) {
    try {
      const { steamLogin, steamPassword } = req.body;
      const user = await sequelize.models.User.findByPk(req.user.id, {
        attributes: ["id", "email", "roles"],
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User actually not found, try to login again",
        });
      }
      const CheckSteamAccount = await sequelize.models.SteamAccount.findOne({
        where: { steamLogin: steamLogin },
      });
      if (CheckSteamAccount) {
        return res.status(400).json({
          success: false,
          message: "Steam account already exists",
        });
      }
      const steamAccount = await sequelize.models.SteamAccount.create({
        userId: user.id,
        steamLogin: steamLogin,
        steamPassword: encryptGCM(steamPassword),
      });
      const state = encryptGCM(steamLogin);
      const authUrl = oauth2url(state);

      return res.status(200).json({
        success: true,
        redirectUrl: authUrl,
      });
    } catch (error) {
      const CheckSteamAccount = await sequelize.models.SteamAccount.findOne({
        where: { steamLogin: steamLogin },
      });
      if (CheckSteamAccount) {
        await CheckSteamAccount.destroy();
      }
      console.error("Error in addaccount " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }

  static async google(req, res) {
    try {
      const { code, state } = req.body;

      if (!code || !state) {
        return res
          .status(400)
          .json({ success: false, message: "You are not authorized" });
      }
      const tokens = await getTokensFromCode(code);
      if (!tokens.refresh_token) {
        return res.status(400).json({
          success: false,
          message:
            "No refresh token received. User may have already authorized.",
        });
      }
      const emailInfo = await getUserInfo(tokens.access_token);

      const steamLogin = decryptGCM(state);
      const steamAccount = await sequelize.models.SteamAccount.findOne({
        where: { steamLogin: steamLogin },
      });
      if (!steamAccount) {
        return res.status(400).json({
          success: false,
          message: "Steam account not found",
        });
      }

      // Шифруем токены перед сохранением
      steamAccount.access_token = encryptGCM(tokens.access_token);
      steamAccount.refresh_token = encryptGCM(tokens.refresh_token);
      steamAccount.provider = "google";
      steamAccount.status = "connected";
      steamAccount.email = emailInfo.email;
      await steamAccount.save();

      // Запускаем процесс входа в Steam
      const result = await firstLogin(steamAccount.id);
      if (result.success === false) {
        await steamAccount.destroy();
      }
      return res.status(200).json({
        success: true,
        message: "Google account successfully connected",
      });
    } catch (error) {
      const steamAccount = await sequelize.models.SteamAccount.findOne({
        where: { steamLogin: steamLogin },
      });
      if (steamAccount) {
        await steamAccount.destroy();
      }
      console.error("Error in google OAuth:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to authenticate with Google",
      });
    }
  }

  static async addMailRuAccount(req, res) {
    try {
      const { steamLogin, steamPassword, email, emailPassword } = req.body;
      const user = await sequelize.models.User.findByPk(req.user.id, {
        attributes: ["id", "email", "roles"],
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User actually not found, try to login again",
        });
      }
      const CheckSteamAccount = await sequelize.models.SteamAccount.findOne({
        where: { steamLogin: steamLogin },
      });
      if (CheckSteamAccount) {
        return res.status(400).json({
          success: false,
          message: "Steam account already exists",
        });
      }
      const steamAccount = await sequelize.models.SteamAccount.create({
        userId: user.id,
        steamLogin: steamLogin,
        steamPassword: encryptGCM(steamPassword),
        email: email,
      });
    } catch (error) {
      console.error("Error in addMailRuAccount " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }

  static async getSteamAccounts(req, res) {
    try {
      const steamAccounts = await sequelize.models.SteamAccount.findAll({
        where: { userId: req.user.id },
      });
      return res
        .status(200)
        .json({ success: true, steamAccounts: steamAccounts });
    } catch (error) {
      console.error("Error in getSteamAccounts " + error);
      return res.status(400).json({ success: false, message: "Error server" });
    }
  }
}
export default steamController;
