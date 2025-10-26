import styles from "./addPool.module.scss";
import api from "../../middleware/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const AddPool = () => {
  const location = useLocation();
  const [steamAccounts, setSteamAccounts] = useState([
    {
      id: "b3f9a2c4-8e2a-4d1f-9c6b-2a1d4f6e7b88",
      steamLogin: "gamer_one",
    },
    {
      id: "c6d1b3e7-2a11-4a9f-9d55-3c9b8a7f1234",
      userId: "d9f8c7b6-1234-4bcd-9aef-5a6b7c8d9e01",
      steamLogin: "noob_master",
      steamPassword: "v1:BASE64_ENC_PAYLOAD_DEF789",
      access_token: null,
      refresh_token: null,
      provider: "password",
      status: "disabled",
      email: "noob_master@mail.com",
      game: "Dota 2",
      steam_refresh_token: "v1:BASE64_STEAM_REFRESH_456DEF==",
      steam_id: "76561198000000002",
      createdAt: "2025-09-10T16:00:00.000Z",
      updatedAt: "2025-10-01T11:25:10.000Z",
    },
    {
      id: "a1e2b3c4-d5f6-47a8-b9c0-112233445566",
      userId: "aa11bb22-33cc-44dd-55ee-66778899aabb",
      steamLogin: "pro_player",
      steamPassword: "v1:BASE64_ENC_PAYLOAD_XYZ000",
      access_token: "v1:BASE64_ENC_TOKEN_XYZ789==",
      refresh_token: "v1:BASE64_ENC_REFRESH_XYZ101==",
      provider: "oauth",
      status: "active",
      email: "pro.player@provider.com",
      game: "Valheim",
      steam_refresh_token: null,
      steam_id: "76561198000000003",
      createdAt: "2025-01-05T08:30:00.000Z",
      updatedAt: "2025-06-20T12:45:30.000Z",
    },
  ]);
  const services = [
    {
      id: "1",
      name: "Test",
      price: "100",
    },
    {
      id: "2",
      name: "Test 2",
      price: "200",
    },
  ];

  const [selectedSteamAccount, setSelectedSteamAccount] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [poolAccounts, setPoolAccounts] = useState([]);
  const [poolServices, setPoolServices] = useState([]);
  const [namePool, setNamePool] = useState("");
  //const services = location.state?.services || [];
  const funpayAccountId = location.state?.funpayAccountId || "";
  useEffect(() => {
    const handleGetSteamAccounts = async () => {
      try {
        const response = await api.get(`/steam/getaccounts`);
        setSteamAccounts(response.data.steamAccounts);
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
      }
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Failed to create pool. Please try again.");
    }
  };

  return (
    <div className={styles.main}>
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
