import React from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";

const products = [
    { id: '1', title: 'Сумка Fila', price: 1000, description: 'ОригиналЧерного цвета, оригиналЧерного цвета Новый, на гарантии. НовыйЧерного цвета, оригинал', img: '/img/IMAGE 1.jpg' },
    { id: '2', title: 'Сумка Fila', price: 700, description: 'Оригинал, новая Черного цвета, оригиналЧерного цвета, оригинал', img: '/img/IMAGE 2.jpg' },
    { id: '3', title: 'Сумка Puma', price: 1000, description: 'Черного цвета, оригинал Черного цвета, оригинал', img: '/img/IMAGE 3.jpg' },
    { id: '4', title: 'Samsung A15', price: 15000, description: 'Новый, на гарантии. НовыйЧерного цвета, оригинал овыйЧерного цвета, оригиналовыйЧерного цвета, оригинал.', img: '/img/IMAGE 4.jpg' },
    { id: '5', title: 'Сумка Fila', price: 1000, description: 'ОригиналЧерного цвета, оригиналЧерного цвета Новый, на гарантии. НовыйЧерного цвета, оригинал', img: '/img/IMAGE 1.jpg' },
    { id: '6', title: 'Сумка Fila', price: 700, description: 'Оригинал, новая Черного цвета, оригиналЧерного цвета, оригинал', img: '/img/IMAGE 2.jpg' },
    { id: '7', title: 'Сумка Puma', price: 1000, description: 'Черного цвета, оригинал Черного цвета, оригинал', img: '/img/IMAGE 3.jpg' },
    { id: '8', title: 'Samsung A15', price: 15000, description: 'Новый, на гарантии. НовыйЧерного цвета, оригинал овыйЧерного цвета, оригиналовыйЧерного цвета, оригинал.', img: '/img/IMAGE 4.jpg' },
    { id: '9', title: 'Сумка Puma', price: 1000, description: 'Черного цвета, оригинал Черного цвета, оригинал', img: '/img/IMAGE 3.jpg' },
    { id: '10', title: 'Samsung A15', price: 15000, description: 'Новый, на гарантии. НовыйЧерного цвета, оригинал овыйЧерного цвета, оригиналовыйЧерного цвета, оригинал.', img: '/img/IMAGE 4.jpg' },


];

const App = () => {
    return (
      <div className="cards-container">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
      </div>
    );
};

export default App;
