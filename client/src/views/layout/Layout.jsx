import { Outlet } from "react-router-dom";
import Navbar from "../../UI/navbar/NavBar";
import styles from "./layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.back_ground}>
      <div className={styles.root_div}>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
