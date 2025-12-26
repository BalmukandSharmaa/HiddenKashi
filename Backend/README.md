# Swagatam Kashi Backend

A comprehensive backend system for hotel and tour booking platform with three user roles:
- **Customer**: Book hotels and tour trips
- **Hotel Owner**: List and manage hotels and tour packages
- **Admin**: Manage everything, handle support, payments, and refunds

## 🚀 Features

### For Customers
- Register and login with JWT authentication
- Browse hotels and tours
- Book hotels and tour packages
- Make payments
- Cancel bookings
- View booking history
- Create support tickets
- Write reviews

### For Hotel Owners
- Register as hotel owner
- List hotels with details, amenities, room types
- Create tour packages with itineraries
- View bookings for their properties
- Manage hotel and tour listings
- Update availability and pricing

### For Admins (Service Team)
- View all users, hotels, tours, and bookings
- Approve/reject hotel and tour listings
- Process refunds
- Manage support tickets
- View payment statistics
- Help customers and hotel owners
- Activate/deactivate users
- Monitor platform activity

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGOOSE_URI=mongodb://localhost:27017
PORT=5000
ACCESS_TOKEN_SECRET=your_secret_here
REFRESH_TOKEN_SECRET=your_secret_here
```

5. Start the server:
```bash
npm run dev
```

## 📁 Project Structure

```
├── models/              # Database models
│   ├── user.models.js
│   ├── hotel.models.js
│   ├── tour.models.js
│   ├── booking.models.js
│   ├── payment.models.js
│   ├── review.models.js
│   └── supportTicket.models.js
├── controllers/         # Business logic
│   ├── user.controller.js
│   ├── hotel.controller.js
│   ├── tour.controller.js
│   ├── booking.controller.js
│   ├── payment.controller.js
│   └── support.controller.js
├── router/             # API routes
│   ├── user.routes.js
│   ├── hotel.routes.js
│   ├── tour.routes.js
│   ├── booking.routes.js
│   ├── payment.routes.js
│   └── support.routes.js
├── middlewares/        # Custom middlewares
│   └── auth.middleware.js
├── app.js             # Express app setup
├── index.js           # Server entry point
├── db.js              # Database connection
└── constants.js       # Constants
```

## 🔐 User Roles

### Customer (`customer`)
- Book hotels and tours
- Make payments
- View bookings
- Create support tickets

### Hotel Owner (`hotel_owner`)
- Create and manage hotels
- Create and manage tour packages
- View their property bookings
- Requires business license

### Admin (`admin`)
- Full access to all resources
- Approve/reject listings
- Process refunds
- Manage support tickets
- View analytics

## 🌐 API Endpoints

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/logout` - Logout
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/update-profile` - Update profile
- `PATCH /api/v1/users/change-password` - Change password
- `GET /api/v1/users/all` - Get all users (Admin)
- `PATCH /api/v1/users/:userId/toggle-status` - Toggle user status (Admin)

### Hotels
- `GET /api/v1/hotels` - Get all hotels (Public)
- `GET /api/v1/hotels/:id` - Get hotel by ID
- `POST /api/v1/hotels` - Create hotel (Hotel Owner)
- `GET /api/v1/hotels/owner/my-hotels` - Get my hotels (Hotel Owner)
- `PATCH /api/v1/hotels/:id` - Update hotel (Hotel Owner)
- `DELETE /api/v1/hotels/:id` - Delete hotel (Hotel Owner)
- `GET /api/v1/hotels/admin/all` - Get all hotels (Admin)
- `PATCH /api/v1/hotels/admin/:id/status` - Approve/reject hotel (Admin)

### Tours
- `GET /api/v1/tours` - Get all tours (Public)
- `GET /api/v1/tours/:id` - Get tour by ID
- `POST /api/v1/tours` - Create tour (Hotel Owner)
- `GET /api/v1/tours/owner/my-tours` - Get my tours (Hotel Owner)
- `PATCH /api/v1/tours/:id` - Update tour (Hotel Owner)
- `DELETE /api/v1/tours/:id` - Delete tour (Hotel Owner)
- `GET /api/v1/tours/admin/all` - Get all tours (Admin)
- `PATCH /api/v1/tours/admin/:id/status` - Approve/reject tour (Admin)

### Bookings
- `POST /api/v1/bookings` - Create booking (Customer)
- `GET /api/v1/bookings/my-bookings` - Get my bookings (Customer)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `PATCH /api/v1/bookings/:id/cancel` - Cancel booking (Customer)
- `GET /api/v1/bookings/owner/bookings` - Get bookings for owner (Hotel Owner)
- `GET /api/v1/bookings/admin/all` - Get all bookings (Admin)
- `PATCH /api/v1/bookings/admin/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/v1/payments` - Create payment (Customer)
- `GET /api/v1/payments/my-payments` - Get my payments (Customer)
- `GET /api/v1/payments/booking/:bookingId` - Get payment by booking
- `GET /api/v1/payments/admin/all` - Get all payments (Admin)
- `GET /api/v1/payments/admin/stats` - Get payment statistics (Admin)
- `POST /api/v1/payments/admin/:paymentId/refund` - Process refund (Admin)

### Support
- `POST /api/v1/support` - Create ticket
- `GET /api/v1/support/my-tickets` - Get my tickets
- `GET /api/v1/support/:id` - Get ticket by ID
- `POST /api/v1/support/:id/message` - Add message to ticket
- `GET /api/v1/support/admin/all` - Get all tickets (Admin)
- `PATCH /api/v1/support/admin/:id/assign` - Assign ticket (Admin)
- `PATCH /api/v1/support/admin/:id/resolve` - Resolve ticket (Admin)

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the request header:
```
Authorization: Bearer <your_token>
```

Or the token will be automatically sent via httpOnly cookies after login.

## 📝 Example Requests

### Register User
```json
POST /api/v1/users/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

### Create Hotel (Hotel Owner)
```json
POST /api/v1/hotels
{
  "name": "Luxury Hotel",
  "description": "5-star hotel in city center",
  "address": {
    "street": "123 Main St",
    "city": "Varanasi",
    "state": "UP",
    "pincode": "221001",
    "country": "India"
  },
  "location": {
    "coordinates": [82.9739, 25.3176]
  },
  "roomTypes": [
    {
      "type": "Deluxe",
      "price": 5000,
      "capacity": 2,
      "available": 10
    }
  ],
  "amenities": ["WiFi", "Pool", "Restaurant"]
}
```

### Create Booking (Customer)
```json
POST /api/v1/bookings
{
  "bookingType": "hotel",
  "hotel": "hotel_id_here",
  "roomType": "Deluxe",
  "numberOfRooms": 1,
  "checkInDate": "2025-12-20",
  "checkOutDate": "2025-12-22",
  "totalAmount": 10000,
  "guestDetails": {
    "primaryGuest": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- HTTP-only cookies
- Input validation
- Secure password requirements

## 📊 Database Models

All models are defined in the `models/` directory with proper validation and relationships.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 👥 Support

For support, create a ticket through the support system or contact the admin team.
