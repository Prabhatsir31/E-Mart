import React, { useEffect, useState, useRef } from "react";
import "../styles/product.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Products1 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
     fetch("https://localhost:7191/api/Product")
       .then((res) => {
         if (!res.ok) throw new Error("Failed to fetch products");
         return res.json();
       })
       .then((data) => {
         setProducts(data);
         setLoading(false);
       })
       .catch((err) => {
         setError(err.message);
         setLoading(false);
       });
   }, []);

  // Filter products to get odd IDs between 15 and 35 inclusive
  const filteredProducts = products.filter(
    (product) =>
      product.productId % 2 !== 0 &&
      product.productId >= 15 &&
      product.productId <= 40
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToItem(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToItem(currentIndex + 1);
    }
  };

  const scrollToItem = (index) => {
    if (sliderRef.current && sliderRef.current.children[index]) {
      sliderRef.current.children[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredProducts.length === 0)
    return <div>No products found in the selected range.</div>;

  return (
    <div className="products-container">
      <h2 style={{textAlign:'left'}}>Trending Products</h2>

      <div className="products-slider">
        <button
          className="slider-arrow left"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <FiChevronLeft />
        </button>

        <div className="products-slider-inner" ref={sliderRef}>
          {filteredProducts.map((product) => (
            <div className="simple-product-card" key={product.productId}>
              {product.productImage && (
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="simple-product-image"
                />
              )}
              <h3>{product.productName}</h3>
              <p className="price">Rs {product.productPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <button
          className="slider-arrow right"
          onClick={handleNext}
          disabled={currentIndex === filteredProducts.length - 1}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Products1;
