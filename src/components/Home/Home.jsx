import { useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    const formData = { username, password };
    setPending(true);
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        setPending(false);
        setUsername("");
        setPassword("");
      })
      .catch((err) => {
        setPending(false);
        setError(true);
      });
  }

  return (
    <div className={styles.wrapper}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!pending && (
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
        {pending && <button disabled>Pending...</button>}
        {error && <p>Invalid credentials</p>}
      </form>
    </div>
  );
}

export default Home;
