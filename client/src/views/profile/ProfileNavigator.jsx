import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./profileNavigator.module.scss";
import InformationPersonal from "./InformationPersonal";
import FunpayControl from "./FunpayControl";
import SteamAccountsManager from "./SteamAccountsManager";

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
      case "SteamAccountsManager":
        return <SteamAccountsManager />;
      default:
        return <InformationPersonal />;
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.navbar_profile}>
        <button
          onClick={() => {
            setActiveProfileView("informationPersonal");
          }}
        >
          Information personal
        </button>
        <button
          onClick={() => {
            setActiveProfileView("FunpayControl");
          }}
        >
          Funpay control
        </button>
        <button
          onClick={() => {
            setActiveProfileView("SteamAccountsManager");
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
