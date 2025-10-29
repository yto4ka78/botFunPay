import { useEffect, useState } from "react";
import styles from "./funpayAccountManager.module.scss";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../middleware/api";
import NotificationModal from "../../UI/notificationModal/NotificationModal";

const FunpayAccountManager = () => {
  const { id } = useParams();
  const location = useLocation();
  const funpayName = location.state?.funpayName || "Unknown Account";
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [hideAvailableServices, setHideAvailableServices] = useState(false);
  const [hideInitializedServices, setHideInitializedServices] = useState(false);
  const [hidePools, setHidePools] = useState(false);
  const [pools, setPools] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [initializedServices, setInitializedServices] = useState([
    {
      id: "1",
      name: "Service 1",
      price: 100,
      rentalTime: 1,
    },
    {
      id: "2",
      name: "Service 2",
      price: 200,
      rentalTime: 2,
    },
    {
      id: "3",
      name: "Service 3",
      price: 300,
      rentalTime: 3,
    },
  ]);
  const [selectedService, setSelectedService] = useState(null);
  const [rentalTime, setRentalTime] = useState("");

  useEffect(() => {
    const handleGetInfoAccount = async () => {
      try {
        const response = await api.get(`/funpay/getoffers/${id}`);
        setAvailableServices(response.data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const handleGetInitializedServices = async () => {
      try {
        const response = await api.get(`/funpay/getInitializedServices/${id}`);
        if (response.data.success === false) {
          setResponseMessage(response.data.message);
          setResponseStatus(false);
          setNotificationKey((prev) => prev + 1);
          return;
        }
        setInitializedServices(response.data.services || []);
        setResponseMessage(response.data.message);
        setResponseStatus(true);
        setNotificationKey((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching initialized services:", error);
      }
    };

    const handleGetPools = async () => {
      try {
        const response = await api.get(`/funpay/pools/${id}`);
        setPools(response.data.pools || []);
      } catch (error) {
        console.error("Error fetching pools:", error);
      }
    };

    handleGetInfoAccount();
    handleGetInitializedServices();
    handleGetPools();
  }, [id]);

  const handleInitializeService = async (service) => {
    setSelectedService(service);
  };

  const handleConfirmInitialize = async () => {
    if (!selectedService || !rentalTime) {
      alert("Please specify rental time");
      return;
    }

    try {
      const response = await api.post(`/funpay/addservice`, {
        funpayAccountId: id,
        idInFunpay: selectedService.id,
        name: selectedService.name,
        price: selectedService.price,
        rentalTime: parseInt(rentalTime),
      });

      if (response.data.success) {
        setResponseMessage(response.data.message);
        setResponseStatus(true);
        setNotificationKey((prev) => prev + 1);
      }

      // Update initialized services list
      const updatedResponse = await api.get(
        `/funpay/getInitializedServices/${id}`
      );
      setInitializedServices(updatedResponse.data.services || []);

      // Reset form
      setSelectedService(null);
      setRentalTime("");
    } catch (error) {
      console.error("Error initializing service:", error);
      setResponseMessage(
        error.response?.data?.message || "Error initializing service"
      );
      setResponseStatus(false);
      setNotificationKey((prev) => prev + 1);
    }
  };

  const handleCancelInitialize = () => {
    setSelectedService(null);
    setRentalTime("");
  };
  const handleDeleteService = async (id) => {
    try {
      const response = await api.delete(`/funpay/deleteService/${id}`);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  return (
    <div className={styles.main}>
      <h1>Funpay account: {funpayName}</h1>
      {/* Modal notification */}
      <NotificationModal
        responseMessage={responseMessage}
        responseStatus={responseStatus}
        notificationKey={notificationKey}
      />
      {/* Modal for initializing service */}
      {selectedService && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <h2>Initialize Service</h2>
            <div className={styles.modal_content}>
              <p>
                <strong>Name:</strong> {selectedService.name}
              </p>
              <p>
                <strong>Price:</strong> {selectedService.price}
              </p>
              <div className={styles.input_group}>
                <label htmlFor="rentalTime">Rental Time (hours):</label>
                <input
                  type="number"
                  id="rentalTime"
                  value={rentalTime}
                  onChange={(e) => setRentalTime(e.target.value)}
                  placeholder="Enter rental time"
                  min="1"
                />
              </div>
              <div className={styles.modal_buttons}>
                <button
                  onClick={handleConfirmInitialize}
                  className={styles.confirm_btn}
                >
                  Initialize
                </button>
                <button
                  onClick={handleCancelInitialize}
                  className={styles.cancel_btn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Available services from API */}
      <div className={styles.services_container}>
        <h3>Available services from API:</h3>
        {hideAvailableServices ? (
          <button onClick={() => setHideAvailableServices(false)}>
            Show services
          </button>
        ) : (
          <button onClick={() => setHideAvailableServices(true)}>
            Hide services
          </button>
        )}
      </div>
      {Array.isArray(availableServices) && availableServices.length > 0 ? (
        hideAvailableServices ? (
          <div className={styles.hidden_services}>Services are hidden</div>
        ) : (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableServices.map((service) => (
                  <tr key={service.id}>
                    <td data-label="Name">{service.name}</td>
                    <td data-label="Price">{service.price}</td>
                    <td data-label="Actions">
                      <button
                        onClick={() => handleInitializeService(service)}
                        className={styles.initialize_btn}
                      >
                        Initialize
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className={styles.without_services}>
          No available services from Funpay
        </div>
      )}

      {/* Section 2: Initialized services */}
      <div className={styles.services_container}>
        <h3>Initialized services:</h3>
        {hideInitializedServices ? (
          <button onClick={() => setHideInitializedServices(false)}>
            Show services
          </button>
        ) : (
          <button onClick={() => setHideInitializedServices(true)}>
            Hide services
          </button>
        )}
      </div>
      {Array.isArray(initializedServices) && initializedServices.length > 0 ? (
        hideInitializedServices ? (
          <div className={styles.hidden_services}>Services are hidden</div>
        ) : (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Rental Time (hours)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {initializedServices.map((service) => (
                  <tr key={service.id}>
                    <td data-label="Name">{service.name}</td>
                    <td data-label="Price">{service.price}</td>
                    <td data-label="Rental Time">{service.rentalTime}</td>
                    <td data-label="Actions">
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className={styles.initialize_btn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className={styles.without_services}>No initialized services</div>
      )}

      {/* Section 3: List of pools */}
      <Link
        to={`/addpool/${id}`}
        state={{ funpayAccountId: id }}
        className={styles.add_pool_button}
      >
        Add pool
      </Link>

      <div className={styles.services_container}>
        <h3>List of pools:</h3>
        {hidePools ? (
          <button onClick={() => setHidePools(false)}>Show pools</button>
        ) : (
          <button onClick={() => setHidePools(true)}>Hide pools</button>
        )}
      </div>
      {Array.isArray(pools) && pools.length > 0 ? (
        hidePools ? (
          <div className={styles.hidden_services}>Pools are hidden</div>
        ) : (
          <div className={styles.table_wrap}>
            <table>
              <thead>
                <tr>
                  <th>Pool Name</th>
                  <th>Accounts Count</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool) => (
                  <tr key={pool.id}>
                    <td data-label="Pool Name">{pool.name}</td>
                    <td data-label="Accounts Count">
                      {pool.accountsCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className={styles.without_services}>No pools created</div>
      )}
    </div>
  );
};

export default FunpayAccountManager;
