// This page shows all the products, and lets an Admin add new ones.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // These hold what's typed into the "Add Product" form
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    size: "",
    colour: "",
    price: "",
    stock: "",
  });

  // Check who is logged in, so we know whether to show Admin-only things
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  async function loadProducts() {
    const response = await api.get("/products");
    setProducts(response.data);
  }

  // Run loadProducts() once, as soon as this page opens
  useEffect(() => {
    loadProducts();
  }, []);

  async function handleAddProduct(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      await api.post("/products", {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });

      // Clear the form and refresh the list
      setNewProduct({ name: "", sku: "", size: "", colour: "", price: "", stock: "" });
      loadProducts();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not add product.");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Products</h2>
        <Link to="/sale">Record Sale / Restock &rarr;</Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th>Name</th>
            <th>SKU</th>
            <th>Size</th>
            <th>Colour</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLowStock = product.stock < product.lowStockThreshold;
            return (
              <tr
                key={product._id}
                style={{
                  borderBottom: "1px solid #eee",
                  background: isLowStock ? "#fdecea" : "transparent",
                }}
              >
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.size}</td>
                <td>{product.colour}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No products yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Only show this form if the logged-in user is an Admin */}
      {loggedInUser && loggedInUser.role === "admin" && (
        <form onSubmit={handleAddProduct} style={{ marginTop: 30, borderTop: "1px solid #eee", paddingTop: 20 }}>
          <h3>Add Product (Admin only)</h3>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <input
            placeholder="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="sku"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="size"
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="colour"
            value={newProduct.colour}
            onChange={(e) => setNewProduct({ ...newProduct, colour: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />

          <button type="submit" style={{ padding: 10, background: "black", color: "white", border: "none" }}>
            Save product
          </button>
        </form>
      )}
    </div>
  );
}
