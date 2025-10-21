const { MongoClient } = require('mongodb');

(async () => {
  const client = await MongoClient.connect('mongodb://0.0.0.0:27017', { useUnifiedTopology: true });
  const db = client.db('companyDB');

  await db.collection('departments').deleteMany({});
  await db.collection('employees').deleteMany({});
  await db.collection('products').deleteMany({});

  await db.collection('departments').insertMany([
    { name: 'IT' }, { name: 'Marketing' }, { name: 'Testing' }
  ]);

  await db.collection('employees').insertMany([
    { firstName: 'John',     lastName: 'Doe',     department: 'IT',        salary: 4410 },
    { firstName: 'Amanda',   lastName: 'Smith',   department: 'Marketing', salary: 3100 },
    { firstName: 'Jonathan', lastName: 'White',   department: 'IT',        salary: 5355 },
    { firstName: 'Emma',     lastName: 'Cowell',  department: 'Testing',   salary: 2200 },
    { firstName: 'Thomas',   lastName: 'Brown',   department: 'QA',        salary: 2600 },
  ]);

  await db.collection('products').insertMany([
    { name: 'New Wave Festival',          client: 'MyMusicWave corp.' },
    { name: 'ImRich Banking website',     client: 'ImRich LTD.'       },
    { name: 'Company Intranet Portal',    client: 'ACME'              },
  ]);

  console.log('✅ Seed done');
  await client.close();
})();
