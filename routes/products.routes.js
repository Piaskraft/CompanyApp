// routes/products.routes.js
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// GET /products
router.get('/products', (req, res) => {
  req.db.collection('products')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /products/random
router.get('/products/random', (req, res) => {
  req.db.collection('products')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => res.json(data[0]))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /products/:id
router.get('/products/:id', (req, res) => {
  req.db.collection('products')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(doc => {
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// POST /products — dodaj (np. name, client)
router.post('/products', (req, res) => {
  const { name, client } = req.body;
  req.db.collection('products')
    .insertOne({ name, client })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// PUT /products/:id
router.put('/products/:id', (req, res) => {
  const { name, client } = req.body;
  req.db.collection('products')
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, client } }
    )
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// DELETE /products/:id
router.delete('/products/:id', (req, res) => {
  req.db.collection('products')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
