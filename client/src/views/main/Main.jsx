import { Link } from "react-router-dom";
import styles from "./main.module.scss";
import { useEffect, useState } from "react";
import api from "../../middleware/api";
import { useAuth } from "../../context/AuthContext";
const Main = () => {
  const { isAuthenticated, user, refreshUser } = useAuth();

  return (
    <div className={styles.mainDiv}>
      <div className={styles.formDiv}>
        <h1>Hello to Bot FunPay</h1>
        <h2>Join in your account </h2>
        {isAuthenticated ? (
          <div className={styles.flex_buttons}>
            <Link to="/profile">Profile</Link>
          </div>
        ) : (
          <div className={styles.flex_buttons}>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registration</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
