import { useState } from "react";
import styles from "./registration.module.scss";
import api from "../../middleware/api";
import NotificationDiv from "../../UI/notificationDiv/NotificationDiv";
import { Link } from "react-router-dom";

const Registration = () => {
  const [formAuth, setFormAuth] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);

  const handleChangeFormAuth = (e) => {
    const { name, value } = e.target;
    setFormAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/registration", formAuth);
      setResponseMessage(response.data.message);
      setResponseStatus(response.data.success);
    } catch (error) {
      setResponseMessage("Registration error");
      setResponseStatus(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formDiv}>
          <div className={styles.header}>
            <h1>Create Account</h1>
            <p>Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmitForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formAuth.email}
                onChange={handleChangeFormAuth}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={formAuth.password}
                name="password"
                placeholder="Minimum 8 characters"
                onChange={handleChangeFormAuth}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="repeatPassword">Confirm Password</label>
              <input
                type="password"
                value={formAuth.repeatPassword}
                name="repeatPassword"
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
              Sign Up
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
