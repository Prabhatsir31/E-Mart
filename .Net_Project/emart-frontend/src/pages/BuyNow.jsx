import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "../styles/buynow.css";

const BuyNow = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const quantity = searchParams.get("qty") || 1;
  const navigate = useNavigate();

  const handleConfirmPurchase = () => {
    alert(`Purchase confirmed for product ID: ${id}, quantity: ${quantity}`);
    // You can call API here to save purchase info then redirect
    navigate("/checkout"); // Redirect home after purchase
  };

  return (
    <div className="buy-now-container">
      <h1>Buy Now</h1>
      <p>You are about to purchase product ID: {id}</p>
      <p>Quantity: {quantity}</p>
      <button className="confirm-button" onClick={handleConfirmPurchase}>
        Confirm Purchase
      </button>
    </div>
  );
};

export default BuyNow;
