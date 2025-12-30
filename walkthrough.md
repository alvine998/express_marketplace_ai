# Walkthrough - Marketplace AI Backend

This document provides a walkthrough of the implemented features and instructions on how to verify them.

## Implemented Features:

- **Auth**: User registration and login with JWT.
- **Upload**: Single image upload to Firebase.
- **KYC**: User KYC submission with identity card and selfie.
- **Products**: CRUD operations with pagination and category filtering.
- **Sellers**: Storefront management.
- **Banners**: Promotional banner management.
- **OTP via Email**: One-time password generation and verification.
- **Global Activity Logging (Enhanced)**: Every key action (registration, uploads, CRUD, OTP) is now tracked in the activity logs.
- **Security**: Rate limiting and bot protection.
- **Categories & Subcategories**: Structured product organization.
- **Product & Seller Ratings**: User reviews and star ratings.
- **Cart**: User shopping cart with quantity management.
- **Notifications & FCM**: User alerts and push notification support.
- **Transactions**: Checkout process with stock management and order history.
- **Shipping (RajaOngkir)**: Domestic shipping cost calculation using RajaOngkir API.
- **Payment Gateway (Midtrans)**: Secure payment processing via Midtrans Snap and webhooks.
- **Official Sellers**: Admin-controlled "Official Store" status and verification badges.
- **Social Feed**: User/Seller updates with image support, likes, and comments.
- **Wishlist**: Save products for later viewing and management.
- **Chat & FCM**: Multi-device real-time chat with push notification support.
- **Multiple Addresses (New)**: Manage multiple shipping locations with primary address support.
- **Dockerization**: Ready-to-go Docker setup exposing the app on port 4050.

## Project Structure:
```text
├── src/
│   ├── config/          # Database & Firebase config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, Upload, Security
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes & Swagger
│   ├── utils/           # Utilities (Firebase, Pagination, Email, Logging)
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── Dockerfile           # Docker config
├── docker-compose.yml   # Docker compose config
└── README.md            # Project documentation
```

## How to Verify:

1. **Start the Server**:
   - `npm install`
   - `npm start`
   - Or use Docker: `docker-compose up --build -d`

2. **Access Swagger UI**:
   - Visit `http://localhost:4001/api-docs` (local) or `http://localhost:4050/api-docs` (Docker).

3. **Verify Categories**:
   - `POST /api/categories` to create.
   - `GET /api/categories` to list.
   - `POST /api/subcategories` to create sub-level.

4. **Verify Products**:
   - `POST /api/products` with `subcategoryId`.
   - Use `GET /api/products?subcategoryId={id}` to filter products.

12. **Testing Ratings**:
    - Use `POST /api/ratings/product` (Protected) to rate a product.
    - Use `GET /api/ratings/product/{productId}` to view product reviews.
    - Use `POST /api/ratings/seller` (Protected) to rate a seller.
    - Use `GET /api/ratings/seller/{sellerId}` to view seller reviews.

13. **Testing Cart**:
    - `GET /api/cart` to view items.
    - `POST /api/cart` to add item.
    - `DELETE /api/cart/{id}` to remove.

14. **Testing Notifications**:
    - `GET /api/notifications` to list.
    - `PATCH /api/notifications/{id}/read` to mark as read.

15. **Testing FCM Token**:
    - `POST /api/auth/fcm-token` (Protected) with `{ "fcmToken": "your-token" }`.

16. **Testing Transactions**:
    - `POST /api/transactions/checkout` (Protected) with `paymentMethod` and `shippingAddress`.
    - `GET /api/transactions` to view history.
    - `GET /api/transactions/{id}` to view details.

17. **Testing Shipping**:
    - `GET /api/shipping/provinces` to list provinces.
    - `GET /api/shipping/cities/{provinceId}` to list cities.
    - `POST /api/shipping/cost` with `origin`, `destination`, `weight`, `courier`.

18. **Testing Payments**:
    - `POST /api/payment/token/{transactionId}` (Protected) to get Snap token.
    - `POST /api/payment/notification` (Public) to simulate Midtrans webhook.

19. **Testing Official Sellers (Admin Only)**:
    - `PATCH /api/sellers/{id}/verify` to verify a seller.
    - `PATCH /api/sellers/{id}/official` to toggle official status.

20. **Testing Social Feed**:
    - `POST /api/feed` (Multipart) to create post with `content` and `image`.
    - `GET /api/feed` to view global updates with likes/comments counts.
    - `POST /api/feed/{postId}/like` to toggle like.
    - `POST /api/feed/{postId}/comments` to add feedback.

21. **Testing Wishlist**:
    - `POST /api/wishlist` with `productId` to save an item.
    - `GET /api/wishlist` to view all saved items.
    - `DELETE /api/wishlist/{productId}` to remove.

22. **Testing Chat**:
    - `POST /api/chat/send` (Protected) with `recipientId` and `message`.
    - `GET /api/chat/rooms` to view your conversations.
    - `GET /api/chat/messages/{roomId}` to fetch full history.
    - `PATCH /api/chat/read/{roomId}` to mark messages as read.

23. **Testing Multiple Addresses**:
    - `POST /api/addresses` (Protected) to add a new location.
    - `GET /api/addresses` to list all saved addresses.
    - `PATCH /api/addresses/{id}/primary` to switch your default shipping location.
    - `PUT /api/addresses/{id}` to update details.
    - `DELETE /api/addresses/{id}` to remove (prevents deleting primary).
    - Note: Ensure user has `role: 'admin'` in the database.

5. **Verify Security**:
   - Try > 20 req/min to see rate limiting.
   - Try accessing `/.env` to see blocking.
