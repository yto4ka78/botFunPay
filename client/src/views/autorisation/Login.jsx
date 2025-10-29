import { useState } from "react";
import styles from "./login.module.scss";
import api from "../../middleware/api";
import NotificationDiv from "../../UI/notificationDiv/NotificationDiv";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const navigate = useNavigate();

  const [formAuth, setFormAuth] = useState({
    email: "",
    password: "",
  });

  const handleChangeFormAuth = (e) => {
    const { name, value } = e.target;
    setFormAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await api.post("/auth/login", formAuth);
    const data = response.data;
    if (data.success === true) {
      window.location.href = "/profile";
      return;
    }
    if (data.success === false) {
      setResponseMessage(response.data.message);
      setResponseStatus(response.data.success);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formDiv}>
          <div className={styles.header}>
            <h1>Sign In</h1>
            <p>Welcome back!</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                value={formAuth.email}
                type="email"
                name="email"
                placeholder="example@email.com"
                onChange={handleChangeFormAuth}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                value={formAuth.password}
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChangeFormAuth}
                required
              />
            </div>

            <NotificationDiv
              responseMessage={responseMessage}
              responseStatus={responseStatus}
            />

            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Don't have an account? <Link to="/registration">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
