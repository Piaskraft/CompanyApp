// routes/departments.routes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Department = require('../models/department.model.js');

function badId(res) {
  return res.status(400).json({ message: 'Invalid ID format' });
}

// LISTA
router.get('/departments', async (_req, res) => {
  try {
    const list = await Department.find().sort({ name: 1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PO ID
router.get('/departments/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const one = await Department.findById(req.params.id);
    if (!one) return res.status(404).json({ message: 'Not found' });
    res.json(one);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DODAJ
router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Missing field: name' });

    const created = await Department.create({ name });
    res.status(201).json(created);
  } catch (e) {
    // duplikat nazwy (unikalny indeks) → 409 Conflict
    if (e && (e.code === 11000 || e.name === 'MongoServerError')) {
      return res.status(409).json({ message: 'Department name already exists' });
    }
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

// AKTUALIZUJ
router.put('/departments/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Missing field: name' });

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    if (e && (e.code === 11000 || e.name === 'MongoServerError')) {
      return res.status(409).json({ message: 'Department name already exists' });
    }
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

// USUŃ
router.delete('/departments/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'OK' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
