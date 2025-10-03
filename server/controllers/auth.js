class authControlles {
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
export default authControlles;
