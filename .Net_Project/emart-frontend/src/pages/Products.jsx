import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/product.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Filtered products moved above useEffect
  const filteredProducts = products.filter(
    (product) => product.productId % 2 === 0 && product.productId <= 20
  );

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

  useEffect(() => {
    if (sliderRef.current && sliderRef.current.children[currentIndex]) {
      sliderRef.current.children[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < filteredProducts.length - 1) setCurrentIndex(currentIndex + 1);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Navbar />
    <div className="products-container">
      <h2>Featured Products</h2>

      <div className="products-slider">
        <button
          className="slider-arrow left"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous Products"
        >
          <FiChevronLeft />
        </button>

        <div className="products-slider-inner" ref={sliderRef}>
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="simple-product-card"
              onClick={() => navigate(`/product/${product.productId}`)}  // Matches your route /product/:id
              style={{ cursor: "pointer" }}
              title="Click for details"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/product/${product.productId}`);
                }
              }}
            >
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
          aria-label="Next Products"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
    {/* <Footer /> */}
    </>
  );
};

export default Products;
