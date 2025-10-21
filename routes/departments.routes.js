const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');

// GET /departments — wszystkie
router.get('/departments', async (req, res) => {
  try {
    const data = await Department.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET /departments/random — losowy dokument
router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    if (!count) return res.json(null);
    const rand = Math.floor(Math.random() * count);
    const doc = await Department.findOne().skip(rand);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET /departments/:id — po _id
router.get('/departments/:id', async (req, res) => {
  try {
    const doc = await Department.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found...' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// POST /departments — dodaj
router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    const dep = new Department({ name });
    await dep.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// PUT /departments/:id — aktualizuj (czytelny wariant z save)
router.put('/departments/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const dep = await Department.findById(req.params.id);
    if (!dep) return res.status(404).json({ message: 'Not found...' });
    dep.name = name;
    await dep.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// DELETE /departments/:id — usuń
router.delete('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) return res.status(404).json({ message: 'Not found...' });
    await Department.deleteOne({ _id: dep._id });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
