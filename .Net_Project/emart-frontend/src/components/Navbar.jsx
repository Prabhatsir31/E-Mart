import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/global.css";
import { FaShoppingCart, FaUser, FaBoxOpen } from "react-icons/fa";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleProtectedLinkClick = (e, pageName) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert(`Please login to access your ${pageName}.`);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          e<span>Mart</span>
        </Link>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            aria-label="Search"
          />
          <button>Search</button>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <Link
          to="/cart"
          className={`icon-btn ${!isLoggedIn ? "disabled" : ""}`}
          onClick={(e) => handleProtectedLinkClick(e, "Cart")}
        >
          <FaShoppingCart /> <span style={{ color: "white" }}>Cart</span>
        </Link>

        {/* Show Products link only after login */}
        {isLoggedIn && (
          <Link to="/product" className="icon-btn">
            <FaBoxOpen /> <span>Products</span>
          </Link>
        )}

        {!isLoggedIn ? (
          <Link to="/login" className="icon-btn">
            <FaUser /> <span>Login</span>
          </Link>
        ) : (
          <div
            className="profile-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="icon-btn">
              <FaUser /> <span>Profile</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">Order Page</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


