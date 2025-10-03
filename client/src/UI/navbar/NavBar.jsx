import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";
import logo from "../../assets/images/logo.png";

const NavBar = () => {
  return (
    <div className={styles.navbar_main}>
      <div className={styles.navbar_size}>
        <Link to="/">
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
        </Link>
        <div className={styles.buttons}>
          <Link to="">Main</Link>
          <Link to="">Functions</Link>
        </div>
        <div className={styles.flex}></div>
        <div className={styles.profile_buttons}>
          <Link to="/profile">👤 Profile</Link>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
