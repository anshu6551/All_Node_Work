// Run with: npm run seed:roles
require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');

const roles = [
  { name: 'admin', type: null, description: 'System administrator with full access', permissions: ['*'] },
  { name: 'user', type: 'Student', description: 'Student user', permissions: ['view:own-profile', 'view:own-attendance', 'view:own-results'] },
  { name: 'user', type: 'Teacher', description: 'Teacher user', permissions: ['mark:attendance', 'create:exam', 'assign:marks'] },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding roles...');

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name, type: role.type },
      role,
      { upsert: true, new: true }
    );
  }

  console.log('Roles seeded successfully.');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
