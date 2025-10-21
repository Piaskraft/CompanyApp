// seed.js (fragment poglądowy)
const mongoose   = require('mongoose');
const Employee   = require('./models/employee.model.js');
const Department = require('./models/department.model.js');
const Product    = require('./models/product.model.js');


(async () => {
  await mongoose.connect('mongodb://0.0.0.0:27017/companyDB');

  await Promise.all([
    Employee.deleteMany({}),
    Department.deleteMany({}),
    Product.deleteMany({}),
  ]);

  // 1) Departments
  const deps = await Department.insertMany([
    { name: 'IT' },
    { name: 'Marketing' },
    { name: 'Testing' },
    // jeśli w danych masz „QA”, dodaj:
    { name: 'QA' },
  ]);

  // mapa: nazwa -> _id
  const depId = Object.fromEntries(deps.map(d => [d.name, d._id]));

  // 2) Employees (używamy _id zamiast nazwy)
  await Employee.insertMany([
    { firstName: 'Amanda', lastName: 'Doe', department: depId['Marketing'], salary: 4200 },
    { firstName: 'John',   lastName: 'Smith', department: depId['IT'],       salary: 5000 },
    { firstName: 'Kate',   lastName: 'Moss',  department: depId['Testing'],  salary: 3900 },
    // jeśli wcześniej ktoś miał 'QA':
    { firstName: 'Tom',    lastName: 'Lee',   department: depId['QA'],       salary: 4100 },
  ]);

  // 3) Products (bez zmian, jeśli nie mają relacji)
  await Product.insertMany([
    { name: 'CRM App', client: 'ACME' },
    { name: 'Intranet', client: 'Globex' },
  ]);

  console.log('✅ Seed done');
  await mongoose.disconnect();
})();
