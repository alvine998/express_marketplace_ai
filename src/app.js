const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { limiter, blockBots } = require("./middleware/security");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userKycRoutes = require("./routes/userKycRoutes");
const productRoutes = require("./routes/productRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const otpRoutes = require("./routes/otpRoutes");
const loggingRoutes = require("./routes/loggingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const cartRoutes = require("./routes/cartRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const feedRoutes = require("./routes/feedRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const chatRoutes = require("./routes/chatRoutes");
const addressRoutes = require("./routes/addressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const userRoutes = require("./routes/userRoutes");
const popupPromoRoutes = require("./routes/popupPromoRoutes");
const aiChatbotOrderRoutes = require("./routes/aiChatbotOrderRoutes");
const broadcastNotificationRoutes = require("./routes/broadcastNotificationRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");
const appConfigRoutes = require("./routes/appConfigRoutes");
const faqRoutes = require("./routes/faqRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP to allow Swagger UI to load inline scripts/styles
  }),
);
app.use(blockBots); // Block sensitive file scanners
app.use(limiter); // Global rate limiter (20 req/min)

// Middleware
app.use(cors({ origin: "*" })); // Allow all origins (*)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace AI API",
      version: "1.0.0",
      description: "API for Marketplace AI with Sequelize, Firebase, and JWT",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4001}`,
      },
      {
        url: `http://154.26.137.37:${process.env.PORT || 4015}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/kyc", userKycRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/logs", loggingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/users", userRoutes);
app.use("/api/popup-promos", popupPromoRoutes);
app.use("/api/ai-chatbot-orders", aiChatbotOrderRoutes);
app.use("/api/notifications/broadcast", broadcastNotificationRoutes);
app.use("/api/roles", rolePermissionRoutes);
app.use("/api/app-config", appConfigRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Marketplace AI API is running. Visit /api-docs for documentation.");
});

module.exports = app;
