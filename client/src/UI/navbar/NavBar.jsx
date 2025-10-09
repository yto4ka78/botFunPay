import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { isAuthenticated, user, refreshUser } = useAuth();

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
        </div>
        <div className={styles.flex}></div>
        {isAuthenticated ? (
          <div className={styles.profile_buttons}>
            <Link to="/profile">👤 Profile</Link>
            <button>Logout</button>
          </div>
        ) : (
          <div> </div>
        )}
      </div>
    </div>
  );
};
export default NavBar;
