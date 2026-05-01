const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/error');

// Route files
const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes');
const projects = require('./routes/project.routes');
const tasks = require('./routes/task.routes');
const dashboard = require('./routes/dashboard.routes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174',
    'http://localhost:5175', 'http://127.0.0.1:5175',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

// Set security headers
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts/styles for React
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000 // Increased for development
});
app.use(limiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks);
app.use('/api/dashboard', dashboard);

// Base API route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Team Task Manager API' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Handle React routing, return all requests to React app
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running... please set NODE_ENV to production to serve frontend');
  });
}

// Error handler
app.use(errorHandler);

module.exports = app;
