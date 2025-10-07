import { sequelize } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../middleware/mailer.js";
import bcrypt from "bcrypt";
import { signAccess, signRefresh } from "../middleware/crypto.js";

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

      const payload = { sub: user.id, role: user.role };
      const access = signAccess(payload);
      const refresh = signRefresh({ ...payload, jti: crypto.randomUUID() });

      res.cookie("__Host-access", access, accessCookie);
      res.cookie("__Host-refresh", refresh, refreshCookie);

      res.cookie("XSRF-TOKEN", crypto.randomBytes(32).toString("hex"), {
        httpOnly: false,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });

      res.json({
        success: true,
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      console.error("Auth controller erro " + error);
    }
  }
}
export default authControllers;
