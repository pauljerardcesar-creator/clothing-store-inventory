// This is the Login page - the very first screen anyone sees.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

export default function Login() {
  // These hold whatever the user types into the boxes
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const goToPage = useNavigate();

  async function handleLoginClick(event) {
    event.preventDefault(); // stops the page from refreshing
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", { username, password });

      // Save the login token so we stay logged in
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      goToPage("/products"); // move to the product list page
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong.";
      setErrorMessage(message);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Clothing Store Inventory</h2>
      <p style={{ textAlign: "center", color: "#666" }}>Sign in to continue</p>

      <form onSubmit={handleLoginClick}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />

        {errorMessage && <p style={{ color: "red", fontSize: 13 }}>{errorMessage}</p>}

        <button
          type="submit"
          style={{ width: "100%", padding: 12, background: "black", color: "white", border: "none" }}
        >
          Log in
        </button>
      </form>

      <p style={{ fontSize: 12, color: "#999", marginTop: 16 }}>
        First time using this? Run "node seed.js" in the backend folder first,
        then log in with username "admin" and password "ChangeMe123!"
      </p>
    </div>
  );
}
