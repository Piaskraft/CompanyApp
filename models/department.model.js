// models/department.model.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Department', departmentSchema);
// Model "Department" -> kolekcja "departments" (auto pluralizacja)
