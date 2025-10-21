const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// GET all
router.get('/products', async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET random
router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (!count) return res.json(null);
    const rand = Math.floor(Math.random() * count);
    const doc = await Product.findOne().skip(rand);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET by id
router.get('/products/:id', async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found...' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// POST new
router.post('/products', async (req, res) => {
  try {
    const { name, client } = req.body;
    const product = new Product({ name, client });
    await product.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// PUT update
router.put('/products/:id', async (req, res) => {
  try {
    const { name, client } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found...' });
    product.name = name;
    product.client = client;
    await product.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// DELETE
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found...' });
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
