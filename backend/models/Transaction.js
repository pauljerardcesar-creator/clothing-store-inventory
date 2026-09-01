// This file describes what a "Transaction" looks like - that's our word
// for either a Sale (stock going down) or a Restock (stock going up).

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["sale", "restock"], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // We save a copy of the product's name here too. That way, even if the
    // product is deleted later, this old record still makes sense to read.
    productNameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
