// routes/departments.routes.js
const express = require('express');
const { ObjectId } = require('mongodb'); // potrzebne do _id z Mongo
const router = express.Router();

// GET /departments — pobierz wszystkie
router.get('/departments', (req, res) => {
  req.db.collection('departments')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /departments/random — losowy dokument
router.get('/departments/random', (req, res) => {
  req.db.collection('departments')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => res.json(data[0])) // przy pustej kolekcji będzie undefined — ok na tym etapie
    .catch(err => res.status(500).json({ message: err }));
});

// GET /departments/:id — po _id
router.get('/departments/:id', (req, res) => {
  req.db.collection('departments')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(doc => {
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// POST /departments — dodaj
router.post('/departments', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments')
    .insertOne({ name })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// PUT /departments/:id — zaktualizuj
router.put('/departments/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments')
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name } })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// DELETE /departments/:id — usuń
router.delete('/departments/:id', (req, res) => {
  req.db.collection('departments')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
