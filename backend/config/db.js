const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/afnan_admin');
    console.log('✅ MongoDB connected successfully');
    await seedAdmin();
    await seedSettings();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const Admin = require('../models/Admin');
    const count = await Admin.countDocuments();
    if (count === 0) {
      const hashed = await bcrypt.hash('Afnan-12345', 12);
      await Admin.create({
        email: 'info.marpcs0022@gmail.com',
        password: hashed,
        name: 'Afnan Admin',
      });
      console.log('✅ Default admin user seeded: info.marpcs0022@gmail.com / Afnan-12345');
    }
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
};

const seedSettings = async () => {
  try {
    const Settings = require('../models/Settings');
    const count = await Settings.countDocuments();
    if (count === 0) {
      await Settings.create({});
      console.log('✅ Default settings seeded');
    }
  } catch (err) {
    console.error('Seed settings error:', err.message);
  }
};

module.exports = connectDB;
