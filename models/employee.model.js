// models/employee.model.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  lastName:  { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  department:{ type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  salary:    { type: Number, required: true, min: 0, max: 1_000_000 },
}, { timestamps: true });

employeeSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
