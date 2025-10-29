import styles from "./addPool.module.scss";
import api from "../../middleware/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationModal from "../../UI/notificationModal/NotificationModal";
const AddPool = () => {
  const location = useLocation();
  const [steamAccounts, setSteamAccounts] = useState([]);
  const [selectedSteamAccount, setSelectedSteamAccount] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [poolAccounts, setPoolAccounts] = useState([]);
  const [poolServices, setPoolServices] = useState([]);
  const [namePool, setNamePool] = useState("");
  const [services, setServices] = useState([]);
  const funpayAccountId = location.state?.funpayAccountId || "";
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  useEffect(() => {
    const handleGetSteamAccounts = async () => {
      try {
        const response = await api.get(`/steam/getaccounts`);
        if (response.data.success === false) {
          console.log("Нету сервисов");
          return;
        }
        setSteamAccounts(response.data.steamAccounts);
        const responseServices = await api.get(
          `/funpay/getInitializedServices/${funpayAccountId}`
        );
        if (responseServices.data.success === false) {
          console.log("Нету аккаунтов");
          return;
        }
        setServices(responseServices.data.services);
      } catch {}
    };
    handleGetSteamAccounts();
  }, []);

  const handleAddSteamAccount = () => {
    if (!selectedSteamAccount) return;

    const account = steamAccounts.find(
      (acc) => acc.id === selectedSteamAccount
    );
    if (account && !poolAccounts.find((acc) => acc.id === account.id)) {
      setPoolAccounts([...poolAccounts, account]);
      setSelectedSteamAccount("");
    }
  };

  const handleAddService = () => {
    if (!selectedService) return;
    const service = services.find((srv) => srv.id === selectedService);
    if (service && !poolServices.find((srv) => srv.id === service.id)) {
      setPoolServices([...poolServices, service]);
      setSelectedService("");
    }
  };

  const handleRemoveAccount = (id) => {
    setPoolAccounts(poolAccounts.filter((acc) => acc.id !== id));
  };

  const handleRemoveService = (id) => {
    setPoolServices(poolServices.filter((srv) => srv.id !== id));
  };

  const handleCreatePool = async () => {
    try {
      const response = await api.post(`/funpay/createpool`, {
        poolAccounts: poolAccounts,
        poolServices: poolServices,
        funpayAccountId: funpayAccountId,
        namePool: namePool,
      });
      if (response.data.success) {
        setPoolAccounts([]);
        setPoolServices([]);
        setResponseMessage(response.data.message);
        setResponseStatus(true);
        setNotificationKey((prev) => prev + 1);
      } else {
        setResponseMessage(response.data.message);
        setResponseStatus(false);
        setNotificationKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Failed to create pool. Please try again.");
    }
  };

  return (
    <div className={styles.main}>
      <NotificationModal
        responseMessage={responseMessage}
        responseStatus={responseStatus}
        notificationKey={notificationKey}
      />
      <h1>Create Pool</h1>

      {/* Select Steam Account */}
      <div className={styles.select_section}>
        <label htmlFor="steamAccount">Select Steam account:</label>
        <div className={styles.select_row}>
          <select
            id="steamAccount"
            value={selectedSteamAccount}
            onChange={(e) => setSelectedSteamAccount(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select account --</option>
            {steamAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.steamLogin}
              </option>
            ))}
          </select>
          <button onClick={handleAddSteamAccount} className={styles.add_button}>
            Add
          </button>
        </div>
      </div>

      {/* Select Service */}
      <div className={styles.select_section}>
        <label htmlFor="service">Select service:</label>
        <div className={styles.select_row}>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}₽
              </option>
            ))}
          </select>
          <button onClick={handleAddService} className={styles.add_button}>
            Add
          </button>
        </div>
      </div>

      {/* Pool */}
      <div className={styles.pool_section}>
        <h2>Pool</h2>

        <div className={styles.pool_subsection}>
          <h3 className={styles.h3}>Name of pool</h3>
          <input
            type="text"
            id="namePool"
            value={namePool}
            onChange={(e) => setNamePool(e.target.value)}
          />
        </div>
        {/* List of added accounts */}
        <div className={styles.pool_subsection}>
          <h3>Accounts:</h3>
          <div className={styles.pool_items}>
            {poolAccounts.length > 0 ? (
              poolAccounts.map((account) => (
                <div key={account.id} className={styles.pool_item}>
                  <span>{account.steamLogin}</span>
                  <button
                    onClick={() => handleRemoveAccount(account.id)}
                    className={styles.remove_button}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.empty_message}>No added accounts</p>
            )}
          </div>
        </div>

        {/* List of added services */}
        <div className={styles.pool_subsection}>
          <h3>Services:</h3>
          <div className={styles.pool_items}>
            {poolServices.length > 0 ? (
              poolServices.map((service) => (
                <div key={service.id} className={styles.pool_item}>
                  <span>
                    {service.name} - {service.price}₽
                  </span>
                  <button
                    onClick={() => handleRemoveService(service.id)}
                    className={styles.remove_button}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.empty_message}>No added services</p>
            )}
            <button
              className={styles.create_pool_button}
              onClick={() => {
                handleCreatePool();
              }}
            >
              Create pool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPool;
