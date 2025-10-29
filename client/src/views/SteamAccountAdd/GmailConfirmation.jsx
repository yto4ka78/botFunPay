import styles from "./gmailConfirmation.module.scss";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../middleware/api";

const GmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Processing authorization...");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      if (error) {
        setStatus("error");
        setMessage(`${error}`);
        return;
      }

      if (!code || !state) {
        setStatus("error");
        setMessage("You are not authorized");
        return;
      }

      try {
        const response = await api.post("/steam/google", {
          code,
          state,
        });

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message || "Gmail connected successfully!");

          setTimeout(() => {
            navigate("/profile");
          }, 5000);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Error connecting Gmail");
        }
      } catch (error) {
        console.error("Error in OAuth callback:", error);
        setStatus("error");
        setMessage(error.response?.data?.message || "Error connecting Gmail");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Gmail Confirmation</h1>
          <p>Processing your Gmail account connection</p>
        </div>

        {status === "loading" && (
          <div className={styles.statusCard}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.message}>{message}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className={styles.statusCard}>
            <div className={styles.success}>
              <div className={styles.iconContainer}>
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className={styles.message}>{message}</p>
              <p className={styles.subMessage}>Redirecting to profile...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className={styles.statusCard}>
            <div className={styles.error}>
              <div className={styles.iconContainer}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className={styles.message}>{message}</p>
              <button
                onClick={() => navigate("/steamaccountadd")}
                className={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default GmailConfirmation;
