// This file handles recording Sales and Restocks, and looking at the
// history of everything that's happened so far.

const express = require("express");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();

// Recording a SALE means stock goes DOWN.
router.post("/sale", requireLogin, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Please choose a product and a quantity of at least 1." });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Couldn't find that product." });
  }

  // This is the important safety check: never let stock go below zero.
  // We check this here on the server (not just in the app's design) because
  // the server is the only place we can fully trust.
  if (product.stock < quantity) {
    return res.status(400).json({
      message: `Only ${product.stock} left in stock. Please lower the quantity.`,
    });
  }

  product.stock = product.stock - quantity;
  await product.save();

  const record = await Transaction.create({
    type: "sale",
    product: product._id,
    productNameSnapshot: `${product.name} - ${product.size}, ${product.colour}`,
    quantity,
    processedBy: req.user.id,
  });

  res.status(201).json({ transaction: record, stockRemaining: product.stock });
});

// Recording a RESTOCK means stock goes UP. There's no upper limit to check.
router.post("/restock", requireLogin, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Please choose a product and a quantity of at least 1." });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Couldn't find that product." });
  }

  product.stock = product.stock + quantity;
  await product.save();

  const record = await Transaction.create({
    type: "restock",
    product: product._id,
    productNameSnapshot: `${product.name} - ${product.size}, ${product.colour}`,
    quantity,
    processedBy: req.user.id,
  });

  res.status(201).json({ transaction: record, stockRemaining: product.stock });
});

// Shows every sale/restock that has ever happened, newest first.
router.get("/", requireLogin, async (req, res) => {
  const history = await Transaction.find()
    .populate("processedBy", "name")
    .sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;
