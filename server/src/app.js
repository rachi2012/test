const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
app.use(helmet());

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

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Team Task Manager API' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
