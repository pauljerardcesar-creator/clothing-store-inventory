// This page lets someone record a Sale (stock goes down) or a
// Restock (stock goes up).

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

export default function RecordSale() {
  const [mode, setMode] = useState("sale"); // either "sale" or "restock"
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api.get("/products").then((response) => setProducts(response.data));
  }, []);

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post(`/transactions/${mode}`, {
        productId: selectedProductId,
        quantity: Number(quantity),
      });

      const actionWord = mode === "sale" ? "Sale" : "Restock";
      setSuccessMessage(
        `${actionWord} recorded! ${selectedProduct.name} is now at ${response.data.stockRemaining} units.`
      );

      // Refresh the product list so the stock numbers are up to date
      const refreshed = await api.get("/products");
      setProducts(refreshed.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Link to="/products">&larr; Back to Products</Link>
      <h2>Transactions</h2>

      {/* A simple toggle between Sale and Restock */}
      <div style={{ display: "flex", background: "#f2f2f2", borderRadius: 8, padding: 4, marginBottom: 16 }}>
        <div
          onClick={() => setMode("sale")}
          style={{
            flex: 1, textAlign: "center", padding: 8, borderRadius: 6, cursor: "pointer",
            background: mode === "sale" ? "black" : "transparent",
            color: mode === "sale" ? "white" : "#666",
          }}
        >
          Sale
        </div>
        <div
          onClick={() => setMode("restock")}
          style={{
            flex: 1, textAlign: "center", padding: 8, borderRadius: 6, cursor: "pointer",
            background: mode === "restock" ? "black" : "transparent",
            color: mode === "restock" ? "white" : "#666",
          }}
        >
          Restock
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="">Choose a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - {product.size}, {product.colour} ({product.stock} in stock)
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <button
          type="submit"
          disabled={!selectedProductId}
          style={{ width: "100%", padding: 12, background: "black", color: "white", border: "none" }}
        >
          Record {mode}
        </button>
      </form>
    </div>
  );
}
