import { useState } from "react";
import styles from "./informationPersonal.module.scss";

const InformationPersonal = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  return (
    <div className={styles.main}>
      <h1>Information Personal</h1>

      <div className={styles.info_user}>
        <div>
          <p className={styles.label}>Name:</p>
          <p className={styles.value}>yto4ka78</p>
        </div>
        <div>
          <p className={styles.label}>Email:</p>
          <p className={styles.value}>erik.sitnikov.fr@mail.com</p>
        </div>
      </div>

      <div className={styles.change_info_user}>
        <h2>Change info account</h2>
        <form onSubmit={handleSubmit}>
          <label>New email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <label>New name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>New password (If don't wanna change, write nothing)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <label>Repeat password</label>
          <input
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
          />

          <button type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default InformationPersonal;
