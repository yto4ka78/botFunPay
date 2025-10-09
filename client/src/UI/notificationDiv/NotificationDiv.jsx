import styles from "./notificationDiv.module.scss";
const NotificationDiv = ({ responseMessage, responseStatus }) => {
  if (!responseMessage) return null;
  return (
    <>
      <div
        className={`${styles.responseDiv} ${
          responseStatus ? styles.success : styles.error
        }`}
      >
        {responseMessage}
      </div>
    </>
  );
};

export default NotificationDiv;
