import React, { useState } from "react";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleWrite = () => {
    window.location.href = "https://t.me/max12kolt";
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="product-card">
      <div
        className={`image-container ${isZoomed ? "zoomed" : ""}`}
        onClick={handleImageClick}
      >
        <img src={product.img} alt={product.title} className="product-image" />
      </div>
      {!isZoomed && (
        <div className="product-details">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-description">
            {product.description}
          </div>
          <div className="product-footer">
            <span className="product-price">{product.price} ₽</span>
            <button className="write-button" onClick={handleWrite}>
              Написать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
