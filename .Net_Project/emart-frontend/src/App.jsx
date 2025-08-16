// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import SubCategoriesPage from "./pages/SubCategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage"; // Login/Register combined page
import CartPage from "./pages/CartPage";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Invoice from "./pages/InvoicePage";
import Products1 from "./pages/Products1";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";


function App() {
  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/authpage" element={<AuthPage />} />

      {/* Categories list */}
      <Route path="/" element={<CategoriesPage />} />

      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Subcategories for selected category */}
      <Route
        path="/subcategories/:categoryId"
        element={<SubCategoriesPage />}

      />

     <Route path="/product/:id/checkout" element={<Checkout />} />

     <Route path="/orders" element={<Orders />} />


      {/* Products for selected subcategory */}
      <Route path="/products/:subCategoryId" element={<ProductsPage />} />
      <Route path="/product" element={<Products/>} />
      <Route path="/products" element={<Products1/>} />
      <Route path="/cart" element={<CartPage/>}/>
      <Route path="/checkout" element={<Checkout/>} />

      
       <Route path="/invoice" element={<Invoice/>} />
      
    </Routes>
  );
}

export default App;
