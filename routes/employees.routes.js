// routes/employees.routes.js
const express = require('express');
const router = express.Router();

const Employee = require('../models/employee.model.js');
const Department = require('../models/department.model.js');

const mongoose = require('mongoose');

function badId(res) {
  return res.status(400).json({ message: 'Invalid ID format' });
}

function isObjectIdLike(str) {
  return typeof str === 'string' && /^[a-f0-9]{24}$/i.test(str);
}

async function resolveDepartmentId(depField, Department) {
  if (!depField) return null;
  if (isObjectIdLike(depField)) return depField;
  const dep = await Department.findOne({ name: depField });
  return dep ? dep._id : null;
}


// --- GET: lista (z populate) ---
// LISTA z paginacją i sortowaniem
router.get('/employees', async (req, res) => {
  try {
    // /employees?page=1&limit=10&sortBy=lastName&order=asc
    const page   = Math.max(parseInt(req.query.page ?? '1', 10), 1);
    const limit  = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
    const sortBy = (req.query.sortBy ?? 'lastName');       // firstName | lastName | salary | _id ...
    const order  = (req.query.order === 'desc' ? -1 : 1);  // asc (domyślnie) lub desc

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order };

    const [items, total] = await Promise.all([
      Employee.find().populate('department').sort(sort).skip(skip).limit(limit),
      Employee.countDocuments()
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// --- GET: random (z populate) ---
router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const one = await Employee.findOne().skip(rand).populate('department');
    if (!one) return res.status(404).json({ message: 'Not found' });
    res.json(one);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// --- GET: po ID (z populate) ---
router.get('/employees/:id', async (req, res) => {
  try {
    const one = await Employee.findById(req.params.id).populate('department');
    if (!one) return res.status(404).json({ message: 'Not found' });
    res.json(one);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// === Poniższe zostawiamy bez zmian lub uzupełnimy w Kroku 4 ===
// --- POST: dodaj (na razie przyjmuje _id działu) ---
// --- POST: dodaj (akceptuje ID lub nazwę działu) ---
router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, department, salary } = req.body;

    if (!firstName || !lastName || !department) {
      return res.status(400).json({ message: 'Missing fields: firstName, lastName, department' });
    }

    const depId = await resolveDepartmentId(department, Department);
    if (!depId) return res.status(400).json({ message: 'Invalid department (ID or name)' });

    const created = await Employee.create({ firstName, lastName, department: depId, salary });
    res.status(201).json(await created.populate('department'));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// --- PUT: aktualizuj (akceptuje ID lub nazwę działu) ---
router.put('/employees/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const { firstName, lastName, department, salary } = req.body;

    // budujemy obiekt aktualizacji tylko z podanych pól
    const update = {};
    if (typeof firstName !== 'undefined') update.firstName = firstName;
    if (typeof lastName  !== 'undefined') update.lastName  = lastName;
    if (typeof salary    !== 'undefined') update.salary    = salary;

    if (typeof department !== 'undefined') {
      const depId = await resolveDepartmentId(department, Department);
      if (!depId) return res.status(400).json({ message: 'Invalid department (ID or name)' });
      update.department = depId;
    }

    const updated = await Employee
      .findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('department');

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
});
// --- DELETE: usuń ---
router.delete('/employees/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'OK' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
