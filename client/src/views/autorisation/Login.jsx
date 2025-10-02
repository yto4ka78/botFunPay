import styles from "./Login.module.scss";

const Login = () => {
  return (
    <div className={styles.main}>
      <div className={styles.formDiv}>
        <form action="">
          <label htmlFor="">Funpay login</label>
          <input type="text" />

          <label htmlFor="">password</label>
          <input type="text" />

          <button>Connect</button>
        </form>
      </div>
    </div>
  );
};
export default Login;
