const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully! ✅');
  } catch (error) {
    console.error('MongoDB Connection Error ❌:', error.message);
  }
};

// IMPORTANT: Make sure this export line is present at the very bottom!
module.exports = connectDB;