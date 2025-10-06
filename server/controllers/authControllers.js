import db from "../models/index";

class authControllers {
  static async registration(req, res) {
    try {
      const { email, password, repeatPassword } = req.body;
      const userExist = await db.User.findAll({
        where: { email: email },
      });
      if (userExist) {
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
      const newUser = await db.User.create({
        email: email,
        password: password,
      });

      return res.status(201).json({
        success: true,
        message: "User created, confirm email",
      });
    } catch {}
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await fakeFindUser(email);
      if (!user || !(await fakeVerify(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // 2) Сгенерить токены
      const payload = { sub: user.id, role: user.role };
      const access = signAccess(payload);
      const refresh = signRefresh({ ...payload, jti: crypto.randomUUID() });

      // 3) Поставить HttpOnly куки с префиксом __Host- (без Domain, Path=/, Secure)
      res.cookie("__Host-access", access, accessCookie);
      res.cookie("__Host-refresh", refresh, refreshCookie);

      // 4) Выдать XSRF-токен (НЕ HttpOnly, чтобы фронт мог положить его в заголовок)
      res.cookie("XSRF-TOKEN", crypto.randomBytes(32).toString("hex"), {
        httpOnly: false,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });

      res.json({ ok: true, user: { id: user.id, email: user.email } });
    } catch {
      return res.JSON({ answer: "Error server, sorry" });
    }
  }
}
export default authControllers;
