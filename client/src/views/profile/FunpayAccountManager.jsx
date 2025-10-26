import { useEffect, useState } from "react";
import styles from "./funpayAccountManager.module.scss";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../middleware/api";

const FunpayAccountManager = () => {
  const { id } = useParams();
  const location = useLocation();
  const funpayName = location.state?.funpayName || "Unknown Account";
  const [hideServices, setHideServices] = useState(false);
  const [hidePools, setHidePools] = useState(false);
  const [pools, setPools] = useState([]);
  const [services, setServices] = useState([
    {
      name: "TEST Active Matter -Премиальное издания  Версия: Gaijin.Net Вход на аккаунт, Standard Edition",
      price: "228.37 €",
      id: "55134826",
    },
  ]);
  useEffect(() => {
    const handleGetInfoAccount = async () => {
      try {
        const response = await api.get(`/funpay/getoffers/${id}`);
        setServices(response.data.services);
      } catch {}
    };
    handleGetInfoAccount();
  }, []);
  return (
    <div className={styles.main}>
      <h1>Funpay account: {funpayName}</h1>
      <div>
        <Link
          to={`/addpool`}
          state={{ services: services }}
          className={styles.add_pool_button}
        >
          Add pool
        </Link>
      </div>
      <div className={styles.services_container}>
        <h3>List of account services:</h3>
        {hideServices ? (
          <button onClick={() => setHideServices(false)}>Show services</button>
        ) : (
          <button onClick={() => setHideServices(true)}>Hide services</button>
        )}
      </div>
      {Array.isArray(services) && services.length > 0 ? (
        hideServices ? (
          <div className={styles.hidden_services}>Services are hidden</div>
        ) : (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td data-label="Name">{service.name}</td>
                    <td data-label="Price">{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className={styles.error}>You dont have services</div>
      )}
      <div className={styles.services_container}>
        <h3>List of pools:</h3>
        {hidePools ? (
          <button onClick={() => setHidePools(false)}>Show pools</button>
        ) : (
          <button onClick={() => setHidePools(true)}>Hide pools</button>
        )}
      </div>
    </div>
  );
};

export default FunpayAccountManager;
