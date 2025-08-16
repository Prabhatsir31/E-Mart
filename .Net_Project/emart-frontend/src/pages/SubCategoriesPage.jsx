import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/subcategory.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function SubCategoriesPage() {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category name
  useEffect(() => {
    fetch(`https://localhost:7191/api/Category/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setCategoryName(data.categoryName || "Category"))
      .catch(() => setCategoryName("Category"));
  }, [categoryId]);

  // Fetch subcategories
  useEffect(() => {
    fetch(`https://localhost:7191/api/SubCategory/category/${categoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        return res.json();
      })
      .then((data) => {
        setSubcategories(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subcategories");
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) return <div className="loading">Loading subcategories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    <Navbar />
    <div className="subcategories-container">
      <h1>{categoryName}</h1>
      <div className="subcategory-grid">
        {subcategories.map((subcat) => (
          <Link
            key={subcat.subCategoryId}
            to={`/products/${subcat.subCategoryId}`}
            className="subcategory-card"
          >
            <img
              src={subcat.subCategoryImage || "https://via.placeholder.com/200"}
              alt={subcat.subCategoryName}
            />
            <h3>{subcat.subCategoryName}</h3>
          </Link>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default SubCategoriesPage;
