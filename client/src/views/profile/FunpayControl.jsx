import styles from "./funpayControl.module.scss";
import api from "../../middleware/api";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FunpayControl = () => {
  const [IsModalOpen, SetIsModalOpen] = useState(false);
  const { fpaccounts } = useAuth();
  const handleDelete = () => {
    try {
      const response = api("/addfpaccount");
    } catch {}
  };

  return (
    <div className={styles.main}>
      <h1>Funpay Control</h1>
      <button
        className={styles.add_account_button}
        onClick={() => {
          SetIsModalOpen(true);
        }}
      >
        Add new account
      </button>
      <div className={styles.accounts_container}>
        <p className={styles.label}>Your accounts Funpay:</p>
        {Array.isArray(fpaccounts) && fpaccounts.length > 0 ? (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fpaccounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.funpayName}</td>
                    <td>
                      <Link
                        to={`/accountfp/${account.id}`}
                        state={{ funpayName: account.funpayName }}
                      >
                        Manage Account
                      </Link>
                      <button onClick={() => handleDelete(account.id)}>
                        Delete account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>You don't have FunPay accounts</div>
        )}
      </div>

      {IsModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal_howaddacc}>
            <div className={styles.flex_button}>
              <h3>Add your FunPay account</h3>
              <button
                onClick={() => {
                  SetIsModalOpen(false);
                }}
              >
                ×
              </button>
            </div>
            <div className={styles.info}>
              <p>
                To link a FunPay account, first install the{" "}
                <strong>BFP Manager</strong> browser extension.
              </p>
              <p>
                <a
                  href="<!-- put your Chrome Web Store link here -->"
                  target="_blank"
                  rel="noopener"
                >
                  Install the extension
                </a>
              </p>

              <h4>Steps</h4>
              <ol>
                <li>
                  Sign in to your <strong>BotFunPay</strong> account.
                </li>
                <li>
                  Sign in to your <strong>FunPay</strong> account (in the same
                  browser).
                </li>
                <li>
                  Open the <strong>BFP Manager</strong> extension while you are
                  on the FunPay website.
                </li>
                <li>
                  Click <strong>Add account</strong> in the extension.
                </li>
                <li>Return to BotFunPay and refresh the page.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FunpayControl;
