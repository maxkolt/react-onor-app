import styles from "./styles.module.css";
import Header from "../../components/Header";
import Search from "../../components/Search";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import { getAllAds } from "../../api";

export const Main = () => {
  // Храним оригинальный массив объявлений
  const [products, setProducts] = useState([]);
  // Храним отфильтрованный массив объявлений
  const [filterProducts, setFilterProducts] = useState([]);
  // Для ошибок
  const [error, setError] = useState("");
  // Для поиска
  const [searchTerm, setSearchTerm] = useState("");
  // Заглушка
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAds();
        setProducts(data);
        setFilterProducts(data);
      } catch (error) {}
    };

    fetchData();
  }, []);
  // Функция для обновления страницы после добавления нового объявления
  const fetchAndUpdateProducts = async () => {
    try {
      const data = await getAllAds();
      setProducts(data);
      setFilterProducts(data);
    } catch (error) {
      setError("Произошла ошибка: " + error.message);
    }
  };
  // Обработчик изменения строки поиска
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value); 
    setShowNoResultsMessage(false);
  };
  // Фильтрация
  const handleSearchButtonClick = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm !== "") {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterProducts(filtered);
      if (filtered.length === 0) {
        setShowNoResultsMessage(true);
      }
    } else {
      handleShowAllButtonClick();
    }
  };
  // Сброс фильтров
  const handleShowAllButtonClick = () => {
    setFilterProducts(products);
    setSearchTerm("");
    setShowNoResultsMessage(false);
  };
  return (
    <div className={styles.container}>
      <Header onAddNewAd={fetchAndUpdateProducts} />
      <div className={styles.conteiners}>
        <Search
          onSearchInputChange={handleSearchInputChange}
          onSearchButtonClick={handleSearchButtonClick}
          searchTerm={searchTerm}
          onShowAllClick={handleShowAllButtonClick}
          showNoResultsMessage={showNoResultsMessage}
        />
        <div className={styles.main__container}>
          <div className={styles.main__h2}>Объявления</div>
          <div className={styles.main__content}>
            {filterProducts.map((product) => (
              <ProductCard key={product.id} product={product} editLink={`/product/${product.id}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
