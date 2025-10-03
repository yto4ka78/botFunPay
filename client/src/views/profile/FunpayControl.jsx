import styles from "./funpayControl.module.scss";
import api from "../../middleware/api";

const FunpayControl = () => {
  const handleAddFunpayAccount = () => {
    try {
      const response = api("/addfpaccount");
    } catch {}
  };
  return (
    <div className={styles.main}>
      <div className={styles.accounts_container}>
        <h1>Funpay Control</h1>
        <div>
          <p className={styles.label}>Your accounts Funpay:</p>
          <div className={styles.accounts_name}>
            <p className={styles.value}>My account</p>
            <div style={{ flex: "1" }}></div>
            <button>Delete account</button>
          </div>
        </div>
      </div>
      <div className={styles.add_account}>
        <h2>Manage of account</h2>
        <button>Add new account</button>
      </div>
    </div>
  );
};
export default FunpayControl;
