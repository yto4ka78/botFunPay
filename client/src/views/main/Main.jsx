import { Link } from "react-router-dom";
import styles from "./main.module.scss";
const Main = () => {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.formDiv}>
        <h1>Hello to Bot FunPay</h1>
        <h2>Join in your account </h2>
        <div className={styles.flex_buttons}>
          <Link to="/login">Login</Link>
          <Link to="/registration">Registration</Link>
        </div>
      </div>
    </div>
  );
};

export default Main;
