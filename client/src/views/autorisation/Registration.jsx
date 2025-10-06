import { useState } from "react";
import styles from "./registration.module.scss";
import api from "../../middleware/api";

const Registration = () => {
  const [formAuth, setFormAuth] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChangeFormAuth = (e) => {
    const { name, value } = e.target;
    setFormAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async () => {
    try {
      const response = await api("/auth/registration", formAuth);
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
        {errorMessage && <div></div>}

        <button onClick={() => handleSubmitForm()}>Connect</button>
      </div>
    </div>
  );
};
export default Registration;
