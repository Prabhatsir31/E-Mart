import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    IsCardHolder: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // navigation hook

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch("https://localhost:7191/api/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);

        setMessage("Login successful ✅");
        navigate("/"); // redirect to homepage
      } else {
        // REGISTER
        const res = await fetch("https://localhost:7191/api/Auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            IsCardHolder: formData.IsCardHolder,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        setMessage("Registration successful 🎉");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
  <Navbar />
  <div className="auth-container">
    <div className="auth-box">
      <div className="auth-tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="IsCardHolder"
                checked={formData.IsCardHolder}
                onChange={handleInputChange}
              />
              I am a loyalty card holder
            </label>
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      {message && <p className={`auth-message ${message.includes('successful') ? 'success' : ''}`}>{message}</p>}
    </div>
  </div>
  <Footer />
</>

  );
}

export default AuthPage;
