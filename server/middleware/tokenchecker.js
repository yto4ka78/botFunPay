// middleware/requireAuth.js
import jwt from "jsonwebtoken";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function requireAuth({
  roles = null,
  checkCsrf = true,
  xsrfCookieName = "XSRF-TOKEN",
  xsrfHeaderName = "x-xsrf-token",
} = {}) {
  return function (req, res, next) {
    try {
      const token = req.cookies?.["__Host-access"];
      if (!token) {
        return res.status(401).json({ message: "No access" });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (roles && roles.length) {
        const userRoles = Array.isArray(decoded.roles)
          ? decoded.roles
          : decoded.role
          ? [decoded.role]
          : [];

        const allowed = userRoles.some((r) => roles.includes(r));
        if (!allowed) {
          return res.status(401).json({ message: "No access" });
        }
      }

      if (checkCsrf && !SAFE_METHODS.has(req.method)) {
        const xsrfHeader = String(req.headers[xsrfHeaderName] || "");
        const xsrfCookie = String(req.cookies?.[xsrfCookieName] || "");
        if (!xsrfHeader || !xsrfCookie || xsrfHeader !== xsrfCookie) {
          return res.status(401).json({ message: "No access" });
        }
      }

      req.user = {
        id: decoded.sub,
        role: decoded.role,
        roles: decoded.roles,
      };

      return next();
    } catch (err) {
      console.error("Error of tokencatcher " + error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}
