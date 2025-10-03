import { useState } from "react";
import styles from "./registration.module.scss";

const Registration = () => {
  const [formAuth, setFormAuth] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChangeFormAuth = (e) => {
    const { name, value } = e.target;
    setFormAuth((prev) => ({ ...prev, [name]: value }));
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

          <button>Connect</button>
        </form>
      </div>
    </div>
  );
};
export default Registration;
