const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./models/User');

async function run() {
  let exitCode = 0;
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI not set in environment');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const email = 'admin@onlinecomplaint.com';
    const existing = await User.findOne({ email });
    if (existing) {
      await User.deleteOne({ _id: existing._id });
      console.log('Existing admin user deleted');
    }

    const adminData = {
      name: 'System Admin',
      email,
      password: 'admin123',
      phone: '9999999999',
      address: 'Head Office',
      role: 'ADMIN',
      isApproved: true,
    };

    await User.create(adminData);
    console.log('Admin created successfully');
  } catch (err) {
    console.error('Error creating admin:', err);
    exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    process.exit(exitCode);
  }
}

run();
