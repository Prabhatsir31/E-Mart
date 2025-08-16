import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const currentLoyaltyPoints = user.supercoin || 60; // fallback points
  const earnRate = 0.1; // 10% of total order

  const [redeemAppliedItems, setRedeemAppliedItems] = useState({});
  const [useDiscount, setUseDiscount] = useState(false); // 20% discount checkbox

  const toggleRedeem = (productId) => {
    setRedeemAppliedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const calculateFinalPrice = (item) => {
    const price = item.product?.productPrice ?? 0;
    const qty = item.quantity ?? 1;
    let final = price * qty;

    if (useDiscount) final *= 0.8;

    if (redeemAppliedItems[item.productId] && item.product?.redeemPointRequired) {
      final -= Math.min(item.product.redeemPointRequired, final);
    }

    return final < 0 ? 0 : parseFloat(final.toFixed(2));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + calculateFinalPrice(item), 0)
      .toFixed(2);
  };

  const handlePlaceOrder = () => {
    const totalAmount = parseFloat(calculateTotal());
    const pointsEarned = Math.floor(totalAmount * earnRate);

    let totalRedeemed = cartItems.reduce((sum, item) => {
      if (redeemAppliedItems[item.productId] && item.product?.redeemPointRequired) {
        return sum + item.product.redeemPointRequired;
      }
      return sum;
    }, 0);

    const newLoyaltyPoints = currentLoyaltyPoints - totalRedeemed + pointsEarned;

    // Save updated user points
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, supercoin: newLoyaltyPoints })
    );

    // Prepare order details
    const orderDetails = {
      items: cartItems.map((item) => ({
        ...item,
        originalPrice: item.product?.productPrice * item.quantity,
        discountApplied: useDiscount,
        redeemApplied: redeemAppliedItems[item.productId]
          ? item.product.redeemPointRequired
          : 0,
        finalPrice: calculateFinalPrice(item),
      })),
      totalAmount,
      orderDate: new Date().toLocaleString(),
      orderId: Math.floor(Math.random() * 1000000),
    };

    // Save to orders in localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(orderDetails);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Clear cart from localStorage
    localStorage.removeItem("cart");

    // Clear local state to show empty cart
    setCartItems([]);

    alert(
      `Order placed! 🎉 You earned ${pointsEarned} points. Total loyalty points: ${newLoyaltyPoints}`
    );

    // Navigate to invoice
    navigate("/invoice", { state: { orderDetails } });
  };

  if (!cartItems || cartItems.length === 0)
    return (
      <>
        <Navbar />
        <div className="checkout-container">Your cart is empty.</div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="checkout-item">
              <img
                src={item.product?.productImage || "https://via.placeholder.com/100"}
                alt={item.product?.productName}
                className="checkout-item-img"
              />
              <div className="checkout-item-info">
                <h3>{item.product?.productName}</h3>
                <p>Brand: {item.product?.brandName}</p>
                <p>Price per item: ₹{item.product?.productPrice?.toFixed(2) ?? 0}</p>
                <p>Quantity: {item.quantity}</p>

                {item.product?.redeemPointRequired && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={redeemAppliedItems[item.productId] || false}
                        onChange={() => toggleRedeem(item.productId)}
                      />
                      &nbsp;Points to be redeemed: {item.product.redeemPointRequired}
                    </label>
                    <p style={{ fontSize: "0.9rem", color: "#555" }}>
                      Total Loyalty Points Available: {currentLoyaltyPoints}
                    </p>
                  </>
                )}

                {useDiscount && <p>20% Discount Applied</p>}

                <p>
                  <b>Final Price: ₹{calculateFinalPrice(item).toFixed(2)}</b>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="loyalty-container">
          <label>
            <input
              type="checkbox"
              checked={useDiscount}
              onChange={() => setUseDiscount(!useDiscount)}
            />
            Apply 20% discount to all items
          </label>
        </div>

        <div className="checkout-summary">
          <h2>Total Amount: ₹{calculateTotal()}</h2>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
