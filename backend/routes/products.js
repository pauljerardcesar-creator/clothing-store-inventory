// This file handles everything to do with Products:
// viewing the list, adding new ones, editing, and deleting.

const express = require("express");
const Product = require("../models/Product");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Anyone logged in (Staff or Admin) can see the product list.
router.get("/", requireLogin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Only an Admin can add a new product.
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  const { name, sku, size, colour, price, stock } = req.body;

  if (!name || !sku || !size || !colour || price == null) {
    return res.status(400).json({ message: "Please fill in all the fields." });
  }

  const alreadyExists = await Product.findOne({ sku });
  if (alreadyExists) {
    return res.status(409).json({ message: "That SKU is already used by another product." });
  }

  const newProduct = await Product.create({ name, sku, size, colour, price, stock: stock || 0 });
  res.status(201).json(newProduct);
});

// Only an Admin can edit a product. Notice we don't allow changing the
// SKU here - once a product is created, its SKU stays the same forever.
router.put("/:id", requireLogin, requireAdmin, async (req, res) => {
  const { name, size, colour, price } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { name, size, colour, price },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "Couldn't find that product." });
  }
  res.json(updatedProduct);
});

// Only an Admin can delete a product.
router.delete("/:id", requireLogin, requireAdmin, async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Couldn't find that product." });
  }
  res.json({ message: "Product deleted." });
});

module.exports = router;
