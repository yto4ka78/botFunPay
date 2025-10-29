import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./profileNavigator.module.scss";
import InformationPersonal from "./InformationPersonal";
import FunpayControl from "./FunpayControl";
import SteamAccountsControl from "./SteamAccountsControl";

const ProfileNavigator = () => {
  const [activeProfileView, setActiveProfileView] = useState(
    "information personal"
  );
  const RenderViewProfile = () => {
    switch (activeProfileView) {
      case "informationPersonal":
        return <InformationPersonal />;
      case "FunpayControl":
        return <FunpayControl />;
      case "SteamAccountsControl":
        return <SteamAccountsControl />;
      default:
        return <InformationPersonal />;
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.navbar_profile}>
        <button
          className={
            activeProfileView === "informationPersonal" ? styles.active : ""
          }
          onClick={() => {
            setActiveProfileView("informationPersonal");
          }}
        >
          Information personal
        </button>
        <button
          className={activeProfileView === "FunpayControl" ? styles.active : ""}
          onClick={() => {
            setActiveProfileView("FunpayControl");
          }}
        >
          Funpay control
        </button>
        <button
          className={
            activeProfileView === "SteamAccountsControl" ? styles.active : ""
          }
          onClick={() => {
            setActiveProfileView("SteamAccountsControl");
          }}
        >
          Steam accounts
        </button>
      </div>
      <div className={styles.profile_view}>{RenderViewProfile()}</div>
    </div>
  );
};
export default ProfileNavigator;
