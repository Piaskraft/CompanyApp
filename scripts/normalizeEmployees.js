// scripts/normalizeEmployees.js
const mongoose = require('mongoose');

// ⬇⬇⬇ WAŻNE: dopasowane do Twoich nazw plików
const Employee = require('../models/employee.model.js');
const Department = require('../models/department.model.js');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/companyDB';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected');

    const deps = await Department.find().lean();
    const byName = new Map(deps.map(d => [d.name, d._id.toString()]));

    const employees = await Employee.find().lean();
    let changed = 0, missing = 0;

    for (const e of employees) {
      // Jeśli pole jest nazwą działu (a nie ObjectId), podmień na _id
      if (typeof e.department === 'string' && !/^[a-f0-9]{24}$/i.test(e.department)) {
        const id = byName.get(e.department);
        if (id) {
          await Employee.updateOne({ _id: e._id }, { $set: { department: id } });
          console.log(`✔ ${e.firstName} ${e.lastName}: "${e.department}" -> ${id}`);
          changed++;
        } else {
          console.warn(`⚠ Brak działu dla "${e.department}" (employee _id=${e._id})`);
          missing++;
        }
      }
    }

    console.log(`\n✅ Normalizacja zakończona. Zmieniono: ${changed}, brak dopasowania: ${missing}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
