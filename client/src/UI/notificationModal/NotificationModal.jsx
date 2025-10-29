import styles from "./notificationModal.module.scss";
import { useEffect, useState, useRef } from "react";
const NotificationModal = ({ responseMessage, responseStatus }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const [displayStatus, setDisplayStatus] = useState(false);
  const prevMessageRef = useRef("");
  const prevTimestampRef = useRef(0);

  useEffect(() => {
    const currentTimestamp = Date.now();

    if (
      responseMessage &&
      (responseMessage !== prevMessageRef.current ||
        currentTimestamp - prevTimestampRef.current > 500)
    ) {
      prevMessageRef.current = responseMessage;
      prevTimestampRef.current = currentTimestamp;

      setDisplayMessage(responseMessage);
      setDisplayStatus(responseStatus);
      setIsVisible(true);
      setIsClosing(false);

      const closeTimer = setTimeout(() => {
        setIsClosing(true);
      }, 3000);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 3500);

      return () => {
        clearTimeout(closeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [responseMessage, responseStatus]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.notificationModal} ${
        isClosing ? styles.slideOut : styles.slideIn
      }`}
    >
      <div
        className={`${styles.notificationModalContent} ${
          displayStatus ? styles.success : styles.error
        }`}
      >
        <p>{displayMessage}</p>
      </div>
    </div>
  );
};
export default NotificationModal;
