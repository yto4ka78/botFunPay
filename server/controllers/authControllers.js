import { sequelize } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../middleware/mailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  signAccess,
  signRefresh,
  setAuthCookies,
  XSRF_COOKIE_NAME,
  xsrfCookie,
} from "../middleware/crypto.js";

class authControllers {
  static async registration(req, res) {
    try {
      const { email, password, repeatPassword } = req.body;
      const existing = await sequelize.models.User.findOne({
        where: { email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "The email is already in use",
        });
      }
      if (password !== repeatPassword) {
        return res.status(400).json({
          success: false,
          message: "The passwords don't match",
        });
      }
      const verificationToken = uuidv4();
      const verifyLink = `http://${process.env.IP_SERVER}:${process.env.PORT}/verify/${verificationToken}`;
      await sendVerificationEmail(email, verifyLink);
      const newUser = await sequelize.models.User.create({
        email: email,
        password: password,
        verificationToken: verificationToken,
      });

      return res.status(201).json({
        success: true,
        message: "User created, confirm email",
      });
    } catch (error) {
      console.error("Error registration controller " + error);
    }
  }

  static async confirmationEmail(req, res) {
    try {
      const { token } = req.params;
      const user = await sequelize.models.User.findOne({
        where: { verificationToken: token },
      });

      if (!user)
        return res.status(400).json({ message: "Invalid or expired link" });

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      return res
        .status(200)
        .json({ message: "The account has been successfully verified!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await sequelize.models.User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Please confirme your email before logging in" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const payload = { sub: user.id, roles: user.roles };
      const access = signAccess(payload);
      const refresh = signRefresh({ ...payload, jti: crypto.randomUUID() });

      setAuthCookies(res, { access, refresh });
      res.cookie(
        XSRF_COOKIE_NAME,
        crypto.randomBytes(32).toString("hex"),
        xsrfCookie
      );

      res.json({
        success: true,
      });
    } catch (error) {
      console.error("Auth controller error: " + error);
    }
  }

  static async refreshAccessToken(req, res) {
    try {
      const refreshToken = req.cookies["__Host-refresh"];
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
      }

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }

      const payload = {
        sub: decoded.sub,
        role: decoded.role,
        roles: decoded.roles,
      };
      const newAccessToken = signAccess(payload);

      res.cookie("__Host-access", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("Refresh error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
export default authControllers;
