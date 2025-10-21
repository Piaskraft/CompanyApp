const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

// GET all
router.get('/employees', async (req, res) => {
  try {
    const data = await Employee.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET random
router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    if (!count) return res.json(null);
    const rand = Math.floor(Math.random() * count);
    const doc = await Employee.findOne().skip(rand);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET by id
router.get('/employees/:id', async (req, res) => {
  try {
    const doc = await Employee.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found...' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// POST new
router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, department, salary } = req.body;
    const emp = new Employee({ firstName, lastName, department, salary });
    await emp.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// PUT update
router.put('/employees/:id', async (req, res) => {
  try {
    const { firstName, lastName, department, salary } = req.body;
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found...' });
    emp.firstName = firstName;
    emp.lastName = lastName;
    emp.department = department;
    emp.salary = salary;
    await emp.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// DELETE
router.delete('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found...' });
    await Employee.deleteOne({ _id: emp._id });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
