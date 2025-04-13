import { Loader } from "lucide-react";
import styles from "./Loading.module.css";

function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <Loader className={styles.circle}></Loader>
    </div>
  );
}

export default Loading;
