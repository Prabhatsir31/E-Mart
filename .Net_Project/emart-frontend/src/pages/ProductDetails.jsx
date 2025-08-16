import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/productdetails.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    fetch(`https://localhost:7191/api/Product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "N/A";

const handleBuyNow = () => {
  navigate(`/product/${product.id}/checkout`, { state: { product } });
};


  // Add to Cart API call and redirect
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`https://localhost:7191/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product to cart");

      navigate("/cart"); // redirect to cart page after successful add
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-details-container">
        <h1 className="prohead">Product Details</h1>
        <div className="product-details-wrapper">
          <div className="product-image-section">
            <img
              src={product.productImage || "https://via.placeholder.com/400x400?text=No+Image"}
              alt={product.productName}
              className="product-detail-image"
            />
            <div className="product-buttons">
              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="product-info-section">
            <h2>{product.productName}</h2>
            <p>{product.longDescription || "N/A"}</p>
            <p><b>Brand:</b> {product.brandName || "N/A"}</p>
            <p><b>Price:</b> Rs {formatPrice(product.productPrice)}</p>
            <p><b>Loyalty Price:</b> Rs {formatPrice(product.loyaltyCardHolderPrice)}</p>
            <p><b>Redeem Points Required:</b> {product.redeemPointRequired ?? "N/A"}</p>
            <p><b>Stock Available:</b> {product.productStock ?? "N/A"}</p>
            <p><b>Special Offer:</b> {product.isSpecialOffer ? "Yes" : "No"}</p>
            <p><b>Short Description:</b> {product.shortDescription || "N/A"}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
