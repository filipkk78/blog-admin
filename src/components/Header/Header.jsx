import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/">
        <h2>Blog admin</h2>
      </Link>
    </header>
  );
}

export default Header;
