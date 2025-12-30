# Marketplace AI Backend

A robust Express.js backend built with Sequelize (MySQL), Firebase Storage, JWT Authentication, and Swagger documentation.

## Features

- **Authentication**: Secure registration and login using JWT and Bcrypt.
- **User KYC**: Identity verification flow with identity card and selfie uploads to Firebase.
- **Sellers**: Storefront management for users to list products and manage their shop profile.
- **Products**: Full CRUD operations for marketplace products with image support and pagination.
- **File Uploads**: Powered by Multer and Firebase Admin SDK for reliable image hosting.
- **API Documentation**: Interactive Swagger UI for easy exploration and testing.
- **Pagination**: Consistent pagination utility for list endpoints.

## Tech Stack

- **Framework**: Express.js
- **Database**: MySQL (via Sequelize ORM)
- **Authentication**: JWT & Bcrypt.js
- **Cloud Storage**: Firebase Admin SDK
- **Documentation**: Swagger UI & Swagger JSDoc

## Prerequisites

- Node.js (v14+)
- MySQL Server
- Firebase Project & Service Account

## Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd express_marketplace_ai
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and configure the following:

```env
PORT=4001
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=marketplace_ai
JWT_SECRET=your_jwt_secret_key

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### 3. Database Sync
The server is configured to automatically sync models with the database. Ensure the database specified in `DB_NAME` exists.

### 4. Run the Application
```bash
# Production
npm start
```

## API Documentation

Once the server is running, visit the Swagger documentation at:
`http://localhost:4001/api-docs`

## Docker Setup

### 1. Build and Run
```bash
docker-compose up --build -d
```

### 2. Access the Application
The application will be available at `http://localhost:4050`.
Swagger Documentation: `http://localhost:4050/api-docs`.

## Folder Structure

- `src/config`: Configuration for Database and Firebase.
- `src/controllers`: Request handlers for Auth, KYC, Sellers, and Products.
- `src/middleware`: Custom middleware for Auth (JWT) and Uploads (Multer).
- `src/models`: Sequelize model definitions.
- `src/routes`: API route definitions with Swagger annotations.
- `src/utils`: Helper utilities for Firebase and Pagination.
- `app.js`: Main Express application setup.
- `server.js`: Server entry point and database connection logic.
