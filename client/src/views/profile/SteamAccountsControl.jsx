import { useState } from "react";
import styles from "./steamAccountsControl.module.scss";
import { Link } from "react-router-dom";
const SteamAccountsControl = () => {
  const [steamAccs, setSteamAccs] = useState([]);

  const handleDelete = (id) => {};
  return (
    <div className={styles.main}>
      <h1>Steam accounts</h1>
      <Link className={styles.add_account_button}>Add new account</Link>
      <div className={styles.accounts_container}>
        <p className={styles.label}>Your accounts Steam:</p>
        {Array.isArray(steamAccs) && steamAccs.length > 0 ? (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Login</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steamAccs.map((steamAcc) => (
                  <tr key={steamAcc.id}>
                    <td>{steamAcc.login}</td>
                    <td>{steamAcc.email}</td>
                    <td>
                      <Link
                        to={`/accountsteam/${steamAcc.id}`}
                        state={{ steamLogin: steamAcc.login }}
                      >
                        Manage Account
                      </Link>
                      <button onClick={() => handleDelete(steamAcc.id)}>
                        Delete account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>You don't have Steam accounts</div>
        )}
      </div>
    </div>
  );
};

export default SteamAccountsControl;
