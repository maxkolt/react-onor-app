import styles from './styles.module.css';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { useEffect, useState } from 'react';
import { getAllAds } from '../../api';
import Return from '../../components/Return';
import { useNavigate, useParams } from 'react-router-dom';
import user from '../../img/main_img/photo_user.png';

export const Seller = () => {
    const [products, setProducts] = useState([]);
    // Стейт для сокрытия номера
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    // Получени id объявления
    const { sellerId } = useParams();
    const navigate = useNavigate();

    // Обработка даты
    function formatDate(dateString) {
        const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
    
        const date = new Date(dateString);
        const day = date.getDate(); 
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }
    // Получение всех 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getAllAds();
          setProducts(data);
        } catch (error) {
        }
      };
  
      fetchData(); 
    }, []); 

  const filteredProducts = products.filter(product => product.user.id === Number(sellerId));
  if (filteredProducts.length === 0) {
    navigate("/404");
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.conteiners}>
        <Return />
        <div className={styles.main__container}>
          <div className={styles.main__h2}>Профиль продавца</div>
          {filteredProducts.map((product, index) => {
            if (index === 0) {
              return (
                <div key={product.id} className={styles.main__seller}>
                  {product.user.avatar ? (
                      <img className={styles.main__container_img} src={`http://localhost:8090/${product.user.avatar}`} alt='photo user'/>
                    ) : (
                      <img className={styles.main__container_img} src={user} alt='photo user'/>
                    )}
                  <div className={styles.main__seller_info}>
                    <span className={styles.main__seller_name}>{product.user.name}</span>
                    <span>{product.user.city}</span>
                    <span>Продает товары с {formatDate(product.created_on)}</span>
                    <div onClick={() => setShowPhoneNumber(!showPhoneNumber)} className={`${styles.main_button} ${styles.update}`}>
                    <span>
                      {product.user.phone ? (showPhoneNumber ? "Скрыть номер" : `Показать номер`) : "Номер не указан"}
                    </span>
                    <span className={styles.main_button_num}>
                      {product.user.phone ? (showPhoneNumber ? product.user.phone : `${product.user.phone.substring(0, 2)} ❉ ❉ ❉ ❉ ❉ ❉ ❉ ❉ ❉`) : "-"}
                    </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}

          </div>
          <div className={styles.main__h3}>Товары продавца</div>
          <div className={styles.main__content}>
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} sellerId={sellerId}/>
            ))}
          </div>
        </div>
      </div>
  );
}