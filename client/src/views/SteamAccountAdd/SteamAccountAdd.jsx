import styles from "./steamAccountAdd.module.scss";
import api from "../../middleware/api";
import { useState } from "react";

const SteamAccountAdd = () => {
  const [emailType, setEmailType] = useState("");
  const [formData, setFormData] = useState({
    steamLogin: "",
    steamPassword: "",
    email: "",
    emailPassword: "",
  });
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailTypeChange = (e) => {
    setEmailType(e.target.value);
    setResponseMessage(null);
  };

  const handleGmail = async () => {
    try {
      const response = await api.post("/steam/addGmailAccount", formData);
      if (response.data.success && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
      if (response.data.success === false) {
        setResponseMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error in handleSubmit " + error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Add New Steam Account</h1>
          <p>Connect your Steam account to get started</p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.warningBanner}>
            <span className={styles.warningIcon}>⚠️</span>
            <p>This login and password will be sent to the client at FunPay</p>
          </div>

          {responseMessage && (
            <div className={styles.notificationMessage}>{responseMessage}</div>
          )}

          <form>
            <div className={styles.inputGroup}>
              <label htmlFor="emailType">Email Type</label>
              <select
                name="emailType"
                id="emailType"
                value={emailType}
                onChange={handleEmailTypeChange}
                required
              >
                <option value="">-- Select Email Type --</option>
                <option value="gmail">Gmail</option>
                {/* <option value="mailru">Mail.ru</option> */}
              </select>
            </div>

            {emailType && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="steamLogin">Steam Login</label>
                  <input
                    type="text"
                    name="steamLogin"
                    id="steamLogin"
                    placeholder="Enter your Steam login"
                    value={formData.steamLogin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="steamPassword">Steam Password</label>
                  <input
                    type="password"
                    name="steamPassword"
                    id="steamPassword"
                    placeholder="Enter your Steam password"
                    value={formData.steamPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {emailType === "mailru" && (
                  <>
                    <div className={styles.inputGroup}>
                      <label htmlFor="email">Email (Mail.ru)</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@mail.ru"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="emailPassword">Email Password</label>
                      <input
                        type="password"
                        name="emailPassword"
                        id="emailPassword"
                        placeholder="Enter email password"
                        value={formData.emailPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className={styles.buttonRow}>
                  {emailType === "gmail" && (
                    <button
                      type="button"
                      onClick={handleGmail}
                      className={styles.submitButton}
                    >
                      Add Gmail Account
                    </button>
                  )}
                  {emailType === "mailru" && (
                    <button type="button" className={styles.submitButton}>
                      Add Mail.ru Account
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SteamAccountAdd;
