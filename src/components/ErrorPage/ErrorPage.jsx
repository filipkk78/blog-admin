import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const ErrorPage = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <Header></Header>
        <main className={styles.main}>
          <h1>This route doesn't exist</h1>
          <Link to="/">
            You can go back to the home page by clicking here, though!
          </Link>
        </main>
        <Footer></Footer>
      </div>
    </>
  );
};

export default ErrorPage;
