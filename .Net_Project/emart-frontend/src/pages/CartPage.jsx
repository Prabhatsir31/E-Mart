import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cartpage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    isLoyaltyMember: true,
    loyaltyPoints: 2000, // mock starting points
  });

  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your cart.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://localhost:7191/api/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart items");
      const cart = await res.json();
      setCartItems(cart.cartItems || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  // ---------------- Loyalty Purchase Logic ----------------
  const handlePurchase = (product, mode, cashPaid = 0) => {
    let remainingPoints = user.loyaltyPoints;

    // Case 1: Loyalty Price Mode
    if (mode === "loyalty-price") {
      if (!user.isLoyaltyMember) {
        alert("Not a loyalty member.");
        return;
      }
      if (
        product.loyaltyPrice &&
        product.loyaltyPrice < product.productPrice
      ) {
        if (remainingPoints >= product.loyaltyPrice) {
          remainingPoints -= product.loyaltyPrice;
          setUser((prev) => ({ ...prev, loyaltyPoints: remainingPoints }));
          alert(`Bought ${product.productName} at loyalty price.`);
        } else {
          alert("Not enough loyalty points.");
        }
      } else {
        alert("Loyalty price not applicable.");
      }
    }

    // Case 2: Split Payment
    if (mode === "split") {
      const requiredPoints = product.productPrice - cashPaid;
      if (cashPaid <= 0 || cashPaid >= product.productPrice) {
        alert("Invalid cash split.");
        return;
      }
      if (remainingPoints >= requiredPoints) {
        remainingPoints -= requiredPoints;
        setUser((prev) => ({ ...prev, loyaltyPoints: remainingPoints }));
        alert(
          `Bought ${product.productName} with ₹${cashPaid} + ${requiredPoints} points.`
        );
      } else {
        alert("Not enough loyalty points for split payment.");
      }
    }

    // Case 3: Points Only
    if (mode === "points-only") {
      if (remainingPoints >= product.productPrice) {
        remainingPoints -= product.productPrice;
        setUser((prev) => ({ ...prev, loyaltyPoints: remainingPoints }));
        alert(`Bought ${product.productName} fully with loyalty points.`);
      } else {
        alert(
          "Not enough points. Remove products or pay with cash instead."
        );
      }
    }
  };
  // ---------------------------------------------------------

  // Frontend quantity update + backend sync
  const handleQuantityChange = (cartItemId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty < 0) return item; // prevent negative
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    const token = localStorage.getItem("token");
    if (!token) return;

    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    fetch(`https://localhost:7191/api/cart/item/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    }).catch((err) => console.log("Failed to sync quantity:", err));
  };

  const handleRemoveItem = async (cartItemId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://localhost:7191/api/cart/item/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to remove item");
      }

      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.productPrice * item.quantity,
    0
  );

  if (loading) return <div className="loading">Loading cart items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        <p>Loyalty Points: ⭐ {user.loyaltyPoints}</p>

        {cartItems.length === 0 ? (
          <p>Your cart is currently empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.cartItemId} className="cart-item">
                  <img
                    src={item.product.productImage || "/placeholder.jpg"}
                    alt={item.product.productName}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.product.productName}</h3>
                    <p>Price: ₹{item.product.productPrice.toFixed(2)}</p>
                    {item.product.loyaltyPrice && (
                      <p>Loyalty Price: ⭐ {item.product.loyaltyPrice}</p>
                    )}

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cartItemId, -1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cartItemId, 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="item-total">
                      Total: ₹
                      {(item.product.productPrice * item.quantity).toFixed(2)}
                    </p>

                    {/* Loyalty Action Buttons */}
                    <div className="loyalty-actions">
                      <button
                        onClick={() =>
                          handlePurchase(item.product, "loyalty-price")
                        }
                      >
                        Buy with Loyalty Price
                      </button>
                      <button
                        onClick={() =>
                          handlePurchase(item.product, "split", 600)
                        }
                      >
                        Split (₹600 + Points)
                      </button>
                      <button
                        onClick={() =>
                          handlePurchase(item.product, "points-only")
                        }
                      >
                        Buy with Points Only
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.cartItemId)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <h2>Total: ₹{totalPrice.toFixed(2)}</h2>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/cartpage.css";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [pointsToRedeem, setPointsToRedeem] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [pointsEarned, setPointsEarned] = useState(0);

//   const navigate = useNavigate();

//   const fetchUserAndCart = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login to view your cart.");
//       navigate("/login");
//       return;
//     }

//     try {
//       // Fetch user info
//       const userRes = await fetch("https://localhost:7191/api/user/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!userRes.ok) throw new Error("Failed to fetch user data");
//       const userData = await userRes.json();
//       setUser(userData);

//       // Fetch cart items
//       const cartRes = await fetch("https://localhost:7191/api/cart", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!cartRes.ok) throw new Error("Failed to fetch cart items");
//       const cart = await cartRes.json();
//       setCartItems(cart.cartItems || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAndCart();
//   }, []);

//   // Logic to calculate total price & points (from your pseudocode)
//   useEffect(() => {
//     if (!user || cartItems.length === 0) return;

//     let total = 0;
//     let earnedPoints = 0;

//     cartItems.forEach((item) => {
//       const qty = item.quantity;
//       const normalPrice = item.product.productPrice;
//       const loyaltyPrice = item.product.loyaltyCardHolderPrice;

//       if (user.isCardHolder) {
//         const price = loyaltyPrice * qty;
//         total += price;
//         earnedPoints += price * 0.1; // 10% points
//       } else {
//         total += normalPrice * qty;
//       }
//     });

//     // Apply redemption if card holder
//     if (user.isCardHolder && pointsToRedeem > 0) {
//       const redeemable = Math.min(user.ePoints, pointsToRedeem, total);
//       total -= redeemable;
//     }

//     setTotalPrice(total);
//     setPointsEarned(user.isCardHolder ? earnedPoints : 0);
//   }, [cartItems, user, pointsToRedeem]);

//   const handleQuantityChange = (cartItemId, delta) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) => {
//         if (item.cartItemId === cartItemId) {
//           const newQty = item.quantity + delta;
//           if (newQty < 1) return item;
//           return { ...item, quantity: newQty };
//         }
//         return item;
//       })
//     );

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const item = cartItems.find((i) => i.cartItemId === cartItemId);
//     if (!item) return;

//     const newQuantity = item.quantity + delta;

//     fetch(`https://localhost:7191/api/cart/item/${cartItemId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ quantity: newQuantity }),
//     }).catch((err) => console.log("Failed to sync quantity:", err));
//   };

//   const handleRemoveItem = async (cartItemId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await fetch(
//         `https://localhost:7191/api/cart/item/${cartItemId}`,
//         { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error("Failed to remove item");

//       setCartItems((prev) =>
//         prev.filter((item) => item.cartItemId !== cartItemId)
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleCheckout = () => {
//     navigate("/checkout", {
//       state: { cartItems, pointsToRedeem, finalPrice: totalPrice, pointsEarned },
//     });
//   };

//   if (loading) return <div className="loading">Loading cart items...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="cart-container">
//         <h1>Your Cart</h1>
//         {cartItems.length === 0 ? (
//           <p>Your cart is currently empty.</p>
//         ) : (
//           <>
//             <ul className="cart-list">
//               {cartItems.map((item) => (
//                 <li key={item.cartItemId} className="cart-item">
//                   <img
//                     src={item.product.productImage || "/placeholder.jpg"}
//                     alt={item.product.productName}
//                     className="cart-item-image"
//                   />
//                   <div className="cart-item-details">
//                     <h3>{item.product.productName}</h3>

//                     {user?.isCardHolder ? (
//                       <p>
//                         Loyal Price: ₹
//                         {item.product.loyaltyCardHolderPrice.toFixed(2)}
//                       </p>
//                     ) : (
//                       <p>Price: ₹{item.product.productPrice.toFixed(2)}</p>
//                     )}

//                     <div className="quantity-controls">
//                       <button
//                         onClick={() =>
//                           handleQuantityChange(item.cartItemId, -1)
//                         }
//                       >
//                         −
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         onClick={() =>
//                           handleQuantityChange(item.cartItemId, 1)
//                         }
//                       >
//                         +
//                       </button>
//                     </div>

//                     <p className="item-total">
//                       Total: ₹
//                       {(
//                         (user?.isCardHolder
//                           ? item.product.loyaltyCardHolderPrice
//                           : item.product.productPrice) * item.quantity
//                       ).toFixed(2)}
//                     </p>

//                     <button
//                       className="remove-button"
//                       onClick={() => handleRemoveItem(item.cartItemId)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>

//             {user?.isCardHolder && (
//               <div className="redeem-section">
//                 <p>
//                   You have <strong>{user.ePoints}</strong> points.
//                 </p>
//                 <input
//                   type="number"
//                   min="0"
//                   max={user.ePoints}
//                   value={pointsToRedeem}
//                   onChange={(e) => setPointsToRedeem(Number(e.target.value))}
//                 />
//                 <small>Enter points to redeem</small>
//               </div>
//             )}

//             <div className="cart-summary">
//               <h2>Total: ₹{totalPrice.toFixed(2)}</h2>
//               {user?.isCardHolder && (
//                 <p>Points Earned this purchase: {pointsEarned.toFixed(2)}</p>
//               )}
//               <button className="checkout-button" onClick={handleCheckout}>
//                 Proceed to Checkout
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CartPage;
