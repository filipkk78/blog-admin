import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/authorize", {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.status >= 400) {
          setError(true);
          throw new Error("Access denied");
        }
        console.log("Access granted");
        setIsTokenValid(true);
      });
    }
  }, []);

  useEffect(() => {
    if (isTokenValid) {
      navigate("/dashboard");
    }
  });

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
        navigate("/dashboard");
      })
      .catch((err) => {
        setPending(false);
        setError(true);
        throw new Error(err);
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
