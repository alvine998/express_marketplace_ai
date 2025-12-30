const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { limiter, blockBots } = require('./middleware/security');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userKycRoutes = require('./routes/userKycRoutes');
const productRoutes = require('./routes/productRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const otpRoutes = require('./routes/otpRoutes');
const loggingRoutes = require('./routes/loggingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const cartRoutes = require('./routes/cartRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Security Middleware
app.use(helmet()); // Basic security headers
app.use(blockBots); // Block sensitive file scanners
app.use(limiter); // Global rate limiter (20 req/min)

// Middleware
app.use(cors()); // Allow all origins (*)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace AI API',
      version: '1.0.0',
      description: 'API for Marketplace AI with Sequelize, Firebase, and JWT',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4001}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/kyc', userKycRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/logs', loggingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Marketplace AI API is running. Visit /api-docs for documentation.');
});

module.exports = app;
