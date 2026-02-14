const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const contactRoute = require('./routes/contactRoute');
const projectRoute = require('./routes/projectRoute');
const adminRoute = require('./routes/adminRoute');
const weatherRoute = require('./routes/weatherRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  if (process.env.NODE_ENV === 'production') {
    console.error('MongoDB URI missing. Set MONGODB_URI in environment variables.');
    process.exit(1);
  } else {
    console.warn('MONGODB_URI not set. Falling back to local MongoDB instance.');
  }
}

mongoose.connect(mongoUri || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/contact', contactRoute);
app.use('/api/projects', projectRoute);
app.use('/api/admin', adminRoute);
app.use('/api/weather', weatherRoute);

// Resume download endpoint
app.get('/resume', (req, res) => {
  const resumePath = process.env.RESUME_PATH || path.join(__dirname, 'assets', 'resume.pdf');
  res.download(resumePath, 'resume.pdf', (err) => {
    if (err) {
      console.error('Resume download error:', err);
      res.status(404).json({ success: false, message: 'Resume file not found' });
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
