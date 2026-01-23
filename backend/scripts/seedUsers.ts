import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User';


async function seedUsers() {
  await mongoose.connect('mongodb://127.0.0.1:27017/customer_app');

  // 🔥 Clear existing users (safe for dev)
  await User.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword1 = await bcrypt.hash('customer123', 10);
  const customerPassword2 = await bcrypt.hash('customer456', 10);

  await User.insertMany([
    {
      email: 'pradyu.dp@gmail.com',
      password: adminPassword,
      role: 'admin',
      status: 'ACTIVE'
    },
    {
      email: 'pradyumnadp.meskkps@gmail.com',
      password: customerPassword1,
      role: 'customer',
      status: 'ACTIVE'
    },
    {
      email: 'ip832178@gmail.com',
      password: customerPassword2,
      role: 'customer',
      status: 'ACTIVE'
    }
  ]);

  console.log('✅ Users seeded successfully');
  process.exit();
}

seedUsers();
