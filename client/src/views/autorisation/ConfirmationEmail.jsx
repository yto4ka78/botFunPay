import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../middleware/api";
import styles from "./confirmationEmail.module.scss";

const ConfirmationEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Wait please");
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Confirmation error");
      }
    };
    verify();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.formDiv}>
        {status === "loading" && (
          <div>
            <p>{message}</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <p>{message}</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationEmail;
