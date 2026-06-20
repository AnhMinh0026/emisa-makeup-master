const mongoose = require('mongoose');

/**
 * Initializes the connection to the MongoDB database.
 * Uses the connection string defined in the environment variables.
 * Exits the process if the connection fails.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Advise on common network access configurations if connection fails.
    console.error('→ Check MongoDB Atlas Network Access: https://cloud.mongodb.com → Security → Network Access → Allow 0.0.0.0/0');
    process.exit(1);
  }
};

module.exports = connectDB;
