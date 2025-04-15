import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import { Pencil, Check, X, Trash2 } from "lucide-react";

function Dashboard() {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        setIsTokenExpired(true);
        return;
      }
      fetch("https://blog-api-production-3d1f.up.railway.app/api/authorize", {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error("Access denied");
        }
        setIsTokenValid(true);
      });
    }
  }, [token]);
  useEffect(() => {
    fetch("https://blog-api-production-3d1f.up.railway.app/api/posts", {
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
      .catch((error) => setError(error));
  }, [isTokenValid, token, posts]);
  useEffect(() => {
    fetch("https://blog-api-production-3d1f.up.railway.app/api/comments", {
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
      .then((json) => setComments(json.comments))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [isTokenValid, token, comments]);
  if (isTokenExpired) {
    return (
      <div>
        <h1>Token expired</h1> <Link to="/">Log back in to continue</Link>
      </div>
    );
  }
  if (loading) return <Loading></Loading>;
  if (error) {
    return (
      <div>
        <h1>Access denied</h1> <Link to="/">Log in to continue</Link>
      </div>
    );
  }
  function publishToggle(id) {
    fetch(`https://blog-api-production-3d1f.up.railway.app/api/posts/${id}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  function deleteComment(id) {
    fetch(
      `https://blog-api-production-3d1f.up.railway.app/api/comments/${id}`,
      {
        mode: "cors",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleContentChange(e) {
    setContent(e.target.value);
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    const post = { title, content, authorId: 1 };
    setPending(true);
    fetch("https://blog-api-production-3d1f.up.railway.app/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    }).then(() => {
      setPending(false);
      setTitle("");
      setContent("");
    });
  }

  return (
    <div>
      {!isTokenValid && <h1>Access denied</h1>}
      {isTokenValid && (
        <>
          {posts && (
            <>
              <h2>Posts</h2>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Published</th>
                    <th>Change status</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className={styles.post}>
                      <td data-cell="Id">{post.id}</td>
                      <td data-cell="Title">{post.title}</td>
                      <td data-cell="Published" className={styles.iconCell}>
                        {post.published && (
                          <Check className={styles.published} />
                        )}
                        {!post.published && (
                          <X className={styles.unpublished} />
                        )}
                      </td>
                      <td data-cell="Change status" className={styles.iconCell}>
                        <button
                          className={styles.publishBtn}
                          onClick={() => publishToggle(post.id)}
                        >
                          <Pencil></Pencil>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {comments && (
            <>
              <h2>Comments</h2>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Author</th>
                    <th>Content</th>
                    <th>Post id</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id} className={styles.post}>
                      <td data-cell="Id">{comment.id}</td>
                      <td data-cell="Author name">{comment.authorName}</td>
                      <td data-cell="Content">{comment.content}</td>
                      <td data-cell="Post id">{comment.postId}</td>
                      <td data-cell="Delete" className={styles.iconCell}>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className={styles.deleteBtn}
                        >
                          <Trash2></Trash2>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <h2>Add new post</h2>
          <form onSubmit={handlePostSubmit}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={handleContentChange}
              required
            ></textarea>

            {!pending && <button type="submit">Submit</button>}
            {pending && <button disabled>Pending...</button>}
          </form>
        </>
      )}
    </div>
  );
}

export default Dashboard;
