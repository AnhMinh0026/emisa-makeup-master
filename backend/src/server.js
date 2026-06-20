require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const imageRoutes = require('./routes/imageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

/* --- Middlewares --- */
app.use(cors());
app.use(express.json());

/* --- Database Connection --- */
connectDB();

/* --- Routes --- */
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/images', imageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/courses', courseRoutes);

/* --- Server Initialization --- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
