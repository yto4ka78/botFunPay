import { useState } from "react";
import styles from "./registration.module.scss";
import api from "../../middleware/api";
import NotificationDiv from "../../UI/notificationDiv/NotificationDiv";

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

  const handleSubmitForm = async () => {
    try {
      const response = await api.post("/auth/registration", formAuth);
      setResponseMessage(response.data.message);
      setResponseStatus(response.data.success);
    } catch {}
  };

  return (
    <div className={styles.main}>
      <div className={styles.formDiv}>
        <form action="">
          <label htmlFor="">Email</label>
          <input
            type="text"
            name="email"
            value={formAuth.email}
            onChange={handleChangeFormAuth}
          />

          <label htmlFor="">Password</label>
          <input
            type="password"
            value={formAuth.password}
            name="password"
            onChange={handleChangeFormAuth}
          />

          <label htmlFor="">Repeat password</label>
          <input
            type="password"
            value={formAuth.repeatPassword}
            name="repeatPassword"
            onChange={handleChangeFormAuth}
          />
        </form>
        <NotificationDiv
          responseMessage={responseMessage}
          responseStatus={responseStatus}
        />
        {/* {responseMessage && (
          <div
            className={`${styles.responseDiv} ${
              responseStatus ? styles.success : styles.error
            }`}
          >
            {responseMessage}
          </div>
        )} */}

        <button onClick={() => handleSubmitForm()}>Registration</button>
      </div>
    </div>
  );
};
export default Registration;
