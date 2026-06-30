const User = require('./models/User');

module.exports = async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@sivakaasiboutique.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if admin already exists
    let admin = await User.findOne({ email });

    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin',
        phone: '9999999999',
        isActive: true
      });

      console.log('✅ Admin created');
    } else {
      console.log('✅ Admin already exists');
    }

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};