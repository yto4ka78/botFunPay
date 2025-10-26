import styles from "./steamAccountAdd.module.scss";
import api from "../../middleware/api";
import { useState } from "react";
const SteamAccountAdd = () => {
  const [emailType, setEmailType] = useState(""); // "gmail" или "mailru"
  const [formData, setFormData] = useState({
    steamLogin: "",
    steamPassword: "",
    email: "",
    emailPassword: "",
  });
  const [currentGame, setCurrentGame] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailTypeChange = (e) => {
    setEmailType(e.target.value);
    setResponseMessage(null);
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    if (currentGame.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        games: [...prev.games, currentGame.trim()],
      }));
      setCurrentGame("");
    }
  };

  const handleRemoveGame = (e, gameToRemove) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      games: prev.games.filter((g) => g !== gameToRemove),
    }));
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

  // const handleMailRu = async () => {
  //   try {
  //     await api.post("/steam/addMailRuAccount", formData);
  //   } catch (error) {
  //     console.error("Error in handleMailRu " + error);
  //   }
  // };

  return (
    <div className={styles.main}>
      <h1>Add new Steam account</h1>
      <div className={styles.formDiv}>
        <form action="">
          <h3>⚠️ This login and password will be send to client at funpay</h3>
          {responseMessage && (
            <div className={styles.notificationMessage}>{responseMessage}</div>
          )}

          {/* Выбор типа почты */}
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

          {/* Основные поля Steam */}
          {emailType && (
            <>
              <label htmlFor="steamLogin">Steam login</label>
              <input
                type="text"
                name="steamLogin"
                id="steamLogin"
                value={formData.steamLogin}
                onChange={handleChange}
                required
              />
              <label htmlFor="steamPassword">Steam password</label>
              <input
                type="password"
                name="steamPassword"
                id="steamPassword"
                value={formData.steamPassword}
                onChange={handleChange}
                required
              />

              {/* Дополнительные поля для Mail.ru */}
              {emailType === "mailru" && (
                <>
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
                  <label htmlFor="emailPassword">Email password</label>
                  <input
                    type="password"
                    name="emailPassword"
                    id="emailPassword"
                    value={formData.emailPassword}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {/* Кнопки в зависимости от типа почты */}
              <div className={styles.buttonRow}>
                {emailType === "gmail" && (
                  <button type="button" onClick={handleGmail}>
                    Add Gmail Account
                  </button>
                )}
                {emailType === "mailru" && (
                  <button type="button">Add Mail.ru Account</button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
export default SteamAccountAdd;
