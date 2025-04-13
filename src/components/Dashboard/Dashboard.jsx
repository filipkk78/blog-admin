import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

function Dashboard() {
  const [isTokenValid, setIsTokenValid] = useState();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/authorize", {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error("Access denied");
        }
        console.log("Access granted");
        setIsTokenValid(true);
      });
    }
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/api/posts", {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((json) => setPosts(json.posts))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [isTokenValid]);
  if (loading) return <Loading></Loading>;
  if (error) return <h1>An error has occured fetching data from the API</h1>;

  return (
    <div>
      {!isTokenValid && <h1>Access denied</h1>}
      {isTokenValid && (
        <>
          <h2>Posts</h2>
          {posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <h3>{post.title}</h3>
            </article>
          ))}
        </>
      )}
    </div>
  );
}

export default Dashboard;
