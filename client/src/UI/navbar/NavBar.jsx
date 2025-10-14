import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import api from "../../middleware/api";
import { useEffect } from "react";

const NavBar = () => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const handlelogout = async () => {
    const res = await api.post("/auth/logout", null, {
      validateStatus: () => true,
    });
    const success = res.data.success;
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className={styles.navbar_main}>
      <div className={styles.navbar_size}>
        <Link to="/">
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
        </Link>
        <div className={styles.buttons}>
          <Link to="/">Main</Link>
        </div>
        <div className={styles.flex}></div>
        {isAuthenticated ? (
          <div className={styles.profile_buttons}>
            <Link to="/profile">👤 Profile</Link>
            <button
              onClick={() => {
                handlelogout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div> </div>
        )}
      </div>
    </div>
  );
};
export default NavBar;
