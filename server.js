// server.js
const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

mongoClient.connect('mongodb://0.0.0.0:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('❌ Mongo connect error:', err);
  } else {
    console.log('✅ Successfully connected to the database');

    // [3] wybieramy bazę
    const db = client.db('companyDB'); // <- ważne! :contentReference[oaicite:1]{index=1}

    // [4] inicjujemy serwer DOPIERO po udanym połączeniu
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // [5] wstrzykujemy db do każdego requestu
    app.use((req, res, next) => {
      req.db = db; // teraz w routerach: req.db.collection('...')
      next();
    }); // 

    // trasy API
    app.use((req, res, next) => { req.db = db; next(); });
    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes); // :contentReference[oaicite:3]{index=3}

    // 404
    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    });

    // start
    app.listen(8000, () => {
      console.log('🚀 Server is running on port: 8000');
    });
  }
});
