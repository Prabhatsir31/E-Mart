import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/category.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Products from "./Products";
import Coursel from "./Coursel";
import Products1 from "./Products1";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7191/api/Category")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    <Navbar/>
    <div className="categories-container">
      <h1>Categories</h1>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.categoryId}
            to={`/subcategories/${cat.categoryId}`}
            className="category-card"
          >
            <img
              src={cat.categoryImage || "https://via.placeholder.com/200"}
              alt={cat.categoryName}
            />
            <h3>{cat.categoryName}</h3>
          </Link>
        ))}
      </div>
    </div>
    <Products />
    <Coursel />
    <Products1 />
    <Footer/>
    </>
  );
}

export default CategoriesPage;

