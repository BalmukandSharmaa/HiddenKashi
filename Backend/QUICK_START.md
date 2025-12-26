# 🚀 Quick Start Guide

## Setup Instructions

### 1. Install Dependencies
Already done! ✅

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
MONGOOSE_URI=mongodb://localhost:27017
PORT=5000
ACCESS_TOKEN_SECRET=swagatam_kashi_access_secret_2025_change_in_production
REFRESH_TOKEN_SECRET=swagatam_kashi_refresh_secret_2025_change_in_production
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGOOSE_URI in .env
```

### 4. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Testing the API

### Step 1: Register Users

#### Register a Customer
```bash
POST http://localhost:5000/api/v1/users/register
Content-Type: application/json

{
  "fullName": "Raj Kumar",
  "email": "raj@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer"
}
```

#### Register a Hotel Owner
```bash
POST http://localhost:5000/api/v1/users/register
Content-Type: application/json

{
  "fullName": "Hotel Manager",
  "email": "hotel@example.com",
  "password": "password123",
  "phone": "9876543211",
  "role": "hotel_owner",
  "businessName": "Kashi Palace Hotel",
  "businessLicense": "LIC123456"
}
```

#### Register an Admin
```bash
POST http://localhost:5000/api/v1/users/register
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "phone": "9876543212",
  "role": "admin"
}
```

### Step 2: Login
```bash
POST http://localhost:5000/api/v1/users/login
Content-Type: application/json

{
  "email": "raj@example.com",
  "password": "password123"
}
```

Save the `accessToken` from the response!

### Step 3: Test Protected Routes

Use the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## 🔄 User Workflows

### Customer Workflow
1. Register/Login
2. Browse hotels and tours (GET /api/v1/hotels, /api/v1/tours)
3. Create booking (POST /api/v1/bookings)
4. Make payment (POST /api/v1/payments)
5. View bookings (GET /api/v1/bookings/my-bookings)
6. Cancel if needed (PATCH /api/v1/bookings/:id/cancel)
7. Create support ticket if help needed (POST /api/v1/support)

### Hotel Owner Workflow
1. Register/Login with hotel_owner role
2. Create hotel (POST /api/v1/hotels)
3. Wait for admin approval
4. Create tour packages (POST /api/v1/tours)
5. View bookings (GET /api/v1/bookings/owner/bookings)
6. Manage listings (PATCH /api/v1/hotels/:id)

### Admin Workflow
1. Login as admin
2. Review pending hotels (GET /api/v1/hotels/admin/all?status=pending)
3. Approve/reject hotels (PATCH /api/v1/hotels/admin/:id/status)
4. Review tours (GET /api/v1/tours/admin/all)
5. Handle support tickets (GET /api/v1/support/admin/all)
6. Process refunds (POST /api/v1/payments/admin/:paymentId/refund)
7. View statistics (GET /api/v1/payments/admin/stats)
8. Manage users (GET /api/v1/users/all)

## 📱 Recommended Tools

- **Postman** or **Thunder Client** (VS Code extension) for API testing
- **MongoDB Compass** for database visualization
- **Insomnia** as alternative API client

## 🐛 Common Issues

### Issue: Cannot connect to MongoDB
**Solution**: Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: Port already in use
**Solution**: Change PORT in .env file or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: JWT token errors
**Solution**: Make sure ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are set in .env

## 📚 Next Steps

1. Integrate payment gateway (Razorpay/Stripe)
2. Add image upload functionality (Cloudinary/AWS S3)
3. Implement email notifications
4. Add data validation library (Joi/Zod)
5. Add rate limiting
6. Implement caching (Redis)
7. Add API documentation (Swagger)
8. Write unit tests

## 🎯 Key Features Implemented

✅ Three user roles (Customer, Hotel Owner, Admin)
✅ JWT Authentication with refresh tokens
✅ Hotel listing and management
✅ Tour package management
✅ Booking system
✅ Payment processing
✅ Refund handling
✅ Support ticket system
✅ Review system
✅ Role-based access control
✅ Password hashing
✅ Geospatial queries for hotels
✅ Filtering and pagination

Happy Coding! 🎉
