import { Link } from "react-router-dom";
import styles from "./main.module.scss";
import { useAuth } from "../../context/AuthContext";

const Main = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={styles.mainDiv}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>FunPay Bot Manager</h1>
          <p className={styles.subtitle}>
            Automation and management of your FunPay accounts
          </p>
          <p className={styles.description}>
            Professional tool for managing Steam accounts, automating sales and
            monitoring activity
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🎮</div>
            <h3>Steam Management</h3>
            <p>Add and manage Steam accounts with ease</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>💰</div>
            <h3>FunPay Integration</h3>
            <p>Connect FunPay accounts to automate sales</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>📊</div>
            <h3>Analytics</h3>
            <p>Track statistics and optimize your workflow</p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          {isAuthenticated ? (
            <div className={styles.authButtons}>
              <p className={styles.welcomeText}>
                Welcome, <span>{user?.username}</span>!
              </p>
              <Link to="/profile" className={styles.primaryButton}>
                Go to Profile
              </Link>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/registration" className={styles.primaryButton}>
                Get Started
              </Link>
              <Link to="/login" className={styles.secondaryButton}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
