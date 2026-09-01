// This is the starting point of our backend. Running this file starts
// the whole server. Think of it like turning the key in a car.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const transactionRoutes = require("./routes/transactions");

dotenv.config(); // reads the .env file so we can use its values
connectToDatabase();

const app = express();
app.use(cors()); // allows our frontend (running on a different address) to talk to us
app.use(express.json()); // lets us read JSON data sent from the frontend

// A simple check to make sure the server is alive - visit this in a
// browser and you should see {"status":"ok"}
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Everything about logging in lives at /api/auth/...
app.use("/api/auth", authRoutes);

// Everything about products lives at /api/products/...
app.use("/api/products", productRoutes);

// Everything about sales/restocks lives at /api/transactions/...
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running! Visit http://localhost:${PORT}/api/health to check.`);
});
