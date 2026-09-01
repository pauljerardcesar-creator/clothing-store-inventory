// This file describes what a "Product" (a clothing item) looks like.

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Cargo Pants"
    sku: { type: String, required: true, unique: true }, // a unique code for this item
    size: { type: String, required: true },
    colour: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    // How many are currently in stock. This number should ONLY ever change
    // through a Sale or Restock (see transactions.js), never edited directly,
    // so we always have a record of why the number changed.
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 }, // below this = "low stock"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
