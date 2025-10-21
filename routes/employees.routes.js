// routes/employees.routes.js
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// GET /employees — wszystkie
router.get('/employees', (req, res) => {
  req.db.collection('employees')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /employees/random — losowy
router.get('/employees/random', (req, res) => {
  req.db.collection('employees')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => res.json(data[0]))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /employees/:id — po _id
router.get('/employees/:id', (req, res) => {
  req.db.collection('employees')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(doc => {
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// POST /employees — dodaj
// przykładowe pola: firstName, lastName, department, salary
router.post('/employees', (req, res) => {
  const { firstName, lastName, department, salary } = req.body;
  req.db.collection('employees')
    .insertOne({ firstName, lastName, department, salary })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// PUT /employees/:id — aktualizuj
router.put('/employees/:id', (req, res) => {
  const { firstName, lastName, department, salary } = req.body;
  req.db.collection('employees')
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { firstName, lastName, department, salary } }
    )
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

// DELETE /employees/:id — usuń
router.delete('/employees/:id', (req, res) => {
  req.db.collection('employees')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
