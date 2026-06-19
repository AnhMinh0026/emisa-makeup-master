const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('→ Check MongoDB Atlas Network Access: https://cloud.mongodb.com → Security → Network Access → Allow 0.0.0.0/0');
    process.exit(1);
  }
};

module.exports = connectDB;
