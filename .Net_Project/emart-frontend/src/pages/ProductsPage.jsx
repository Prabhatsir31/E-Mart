import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/productpage.css";

function ProductsPage() {
  const { subCategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemChecked, setRedeemChecked] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!subCategoryId) {
      setError("Invalid subcategory");
      setLoading(false);
      return;
    }

    fetch(`https://localhost:7191/api/Product/subcategory/${subCategoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, [subCategoryId]);

  const handleCheckboxChange = (productId) => {
    setRedeemChecked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://localhost:7191/api/cart/add", {
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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add to cart");
      }

      alert(`${product.productName} added to cart!`);
      navigate("/cart");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="products-container">
        <h2 className="products-title">Products</h2>

        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const isRedeem = redeemChecked[product.productId] || false;
              const finalPrice = isRedeem
                ? product.productPrice - product.redeemPointRequired
                : product.productPrice;

              return (
                <div key={product.productId} className="product-card">
                  <img
                    src={product.productImage || "https://via.placeholder.com/150"}
                    alt={product.productName}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-brand">{product.brandName}</p>
                  <p className="product-description">
                    {product.shortDescription || "No description available"}
                  </p>

                  <p className="product-price">
                    Price: ₹{finalPrice.toFixed(2)}
                  </p>
                  {product.loyaltyCardHolderPrice && (
                    <p className="loyal-price">
                      Loyal Price: ₹{product.loyaltyCardHolderPrice.toFixed(2)}
                    </p>
                  )}

                  {product.isSpecialOffer && (
                    <label className="redeem-checkbox">
                      <input
                        type="checkbox"
                        checked={isRedeem}
                        onChange={() => handleCheckboxChange(product.productId)}
                      />
                      Redeem Points ({product.redeemPointRequired})
                    </label>
                  )}

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProductsPage;
