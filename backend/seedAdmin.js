require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin@emisa.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('EmisaPassword2026!', 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword
      });
      console.log('Admin user seeded successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit();
  }
};

seedAdmin();
