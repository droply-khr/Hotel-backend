require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const roomRoutes = require('./routes/room.routes');
const offerRoutes = require('./routes/offer.routes');
const orderRoutes = require('./routes/order.routes');
const staffRoutes = require('./routes/staff.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const emailRoutes = require('./routes/email.routes');

const app = express();

// Basic security
app.use(helmet());

// CORS configuration for production
const allowedOrigins = [
  'https://kashmirilodges.pk',
  'https://www.kashmirilodges.pk',
  'http://localhost:5173', // Vite dev server
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

// Health check endpoints for Render.com
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Kashmiri Lodges API Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/email', emailRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Try database connection (optional - server will work without it)
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.warn('Database connection failed - Server will continue without database features');
    logger.error('Database error:', error.message);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Log but don't exit - let server continue running
});
