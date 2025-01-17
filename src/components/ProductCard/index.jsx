import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import notImage from '../../img/main_img/no-pictures.png'

function ProductCard({ product, editLink }) {
  // Достаем первую картинку продукта
  const firstImageUrl = product.images.length > 0 ? product.images[0].url : '';
  // Достаем и преобразуем дату объявления
  const createdDate = new Date(product.created_on);
  const formattedDate = `${createdDate.toLocaleDateString('ru-RU')} ${createdDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;

  return (
    <div className={styles.content__cards}>
      <div className={styles.cards__item}>
        <div className={styles.cards__card}>
        <div className={styles.card__image}>
          {firstImageUrl ? (
            <img src={`http://localhost:8090/${firstImageUrl}`} alt="product" className={styles.card__image_first}/>
          ) : (
            <img src={notImage} alt="product" className={styles.card__notimage}/>
          )}
        </div>
          <div className={styles.card__content}>
            <Link to={editLink ? editLink : `/product/${product.id}`} className={styles.card__title}><div className={styles.main__h3}>{product.title ? product.title : "Нет названия"}</div></Link>
            <p className={styles.card__price}>{product.price} ₽</p>
            <p className={styles.card__place}>{product.user.city}</p>
            <p className={styles.card__date}>{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;