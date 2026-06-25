const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');
    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} user profiles from the database!`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
