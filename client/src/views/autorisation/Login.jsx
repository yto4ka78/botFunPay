import { useState } from "react";
import styles from "./login.module.scss";
import api from "../../middleware/api";
import NotificationDiv from "../../UI/notificationDiv/NotificationDiv";

const Login = () => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);

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
      window.location.replace(`http://${process.env.API_CLIENT}/profile`);
      return;
    }
    if (data.success === false) {
      setResponseMessage(response.data.message);
      setResponseStatus(response.data.success);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.formDiv}>
        <form action="" onSubmit={handleLogin}>
          <label htmlFor="">Login</label>
          <input
            value={formAuth.email}
            type="email"
            name="email"
            onChange={handleChangeFormAuth}
          />

          <label htmlFor="">Password</label>
          <input
            value={formAuth.password}
            type="password"
            name="password"
            onChange={handleChangeFormAuth}
          />
          <NotificationDiv
            responseMessage={responseMessage}
            responseStatus={responseStatus}
          />
          <button>Connect</button>
        </form>
      </div>
    </div>
  );
};
export default Login;
