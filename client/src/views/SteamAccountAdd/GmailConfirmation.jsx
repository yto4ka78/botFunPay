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
        <h1>Gmail confirmation</h1>
        {status === "loading" && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>{message}</p>
          </div>
        )}
        {status === "success" && (
          <div className={styles.success}>
            <p>✓ {message}</p>
            <p>Redirecting to profile...</p>
          </div>
        )}
        {status === "error" && (
          <div className={styles.error}>
            <p>✗ {message}</p>
            <button onClick={() => navigate("/steamaccountadd")}>
              Try again{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default GmailConfirmation;
