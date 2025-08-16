import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Fallback: use the mock orders from ProfilePage
      setOrders([
        {
          orderId: 12345,
          orderDate: "2025-08-14",
          totalAmount: 2999,
          items: [
            {
              product: {
                productName: "HP Laptop",
                brandName: "HP",
                productImage: "https://via.placeholder.com/80",
              },
              quantity: 1,
              finalPrice: 2999,
              redeemApplied: false,
            },
          ],
        },
        {
          orderId: 12346,
          orderDate: "2025-08-10",
          totalAmount: 1599,
          items: [
            {
              product: {
                productName: "Logitech Mouse",
                brandName: "Logitech",
                productImage: "https://via.placeholder.com/80",
              },
              quantity: 2,
              finalPrice: 799.5,
              redeemApplied: true,
            },
          ],
        },
      ]);
    }
  }, []);

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="order-history-container">
          <h2>Order History</h2>
          <p>You have no past orders.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="order-history-container">
        <h2>Order History</h2>
        {orders
          .slice(0)
          .reverse()
          .map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <span>Order ID: {order.orderId}</span>
                <span>Date: {order.orderDate}</span>
                <span>Total: ₹{order.totalAmount}</span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.product?.productImage || "https://via.placeholder.com/80"}
                      alt={item.product?.productName}
                    />
                    <div className="item-info">
                      <h4>{item.product?.productName || item.name}</h4>
                      <p>Brand: {item.product?.brandName || "N/A"}</p>
                      <p>Quantity: {item.quantity || item.qty}</p>
                      <p>Price: ₹{item.finalPrice || item.price}</p>
                      {item.redeemApplied && (
                        <p style={{ color: "green" }}>Redeem Applied ✅</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <Footer />
    </>
  );
};

export default Orders;