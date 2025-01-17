import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import line from '../../img/main_img/previous.png'

export const NotFound = () => {
  
  return (
    <div className={styles.containers}>
      <div className={styles.container_notFound}>
          <span className={styles.main__h2}>СТРАНИЦА НЕ НАЙДЕНА</span>
          <div className={styles.main__links}>
            <Link to='/'className={styles.main__link} >На главную</Link>
          </div>
          <img src={line} alt="" className={styles.main__links_str} />
      </div> 
    </div>
  );
};
