# API Testing Examples

## Base URL
```
http://localhost:5000/api/v1
```

## 1. USER ENDPOINTS

### Register Customer
```http
POST {{baseUrl}}/users/register
Content-Type: application/json

{
  "fullName": "Raj Kumar",
  "email": "raj@customer.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer"
}
```

### Register Hotel Owner
```http
POST {{baseUrl}}/users/register
Content-Type: application/json

{
  "fullName": "Suresh Patel",
  "email": "suresh@hotel.com",
  "password": "password123",
  "phone": "9876543211",
  "role": "hotel_owner",
  "businessName": "Kashi Grand Hotel",
  "businessLicense": "HOT-LIC-2025-001"
}
```

### Register Admin
```http
POST {{baseUrl}}/users/register
Content-Type: application/json

{
  "fullName": "Admin Sharma",
  "email": "admin@swagatam.com",
  "password": "admin@123",
  "phone": "9876543212",
  "role": "admin"
}
```

### Login
```http
POST {{baseUrl}}/users/login
Content-Type: application/json

{
  "email": "raj@customer.com",
  "password": "password123"
}
```

### Get Current User
```http
GET {{baseUrl}}/users/me
Authorization: Bearer {{accessToken}}
```

### Update Profile
```http
PATCH {{baseUrl}}/users/update-profile
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "fullName": "Raj Kumar Updated",
  "phone": "9999999999",
  "address": {
    "street": "123 Ganga Road",
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "pincode": "221001",
    "country": "India"
  }
}
```

## 2. HOTEL ENDPOINTS

### Create Hotel (Hotel Owner)
```http
POST {{baseUrl}}/hotels
Authorization: Bearer {{hotelOwnerToken}}
Content-Type: application/json

{
  "name": "Kashi Palace Hotel",
  "description": "Luxury 5-star hotel overlooking the Ganges",
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "address": {
    "street": "Dashashwamedh Ghat",
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "pincode": "221001",
    "country": "India"
  },
  "location": {
    "type": "Point",
    "coordinates": [82.9739, 25.3176]
  },
  "amenities": ["WiFi", "Pool", "Restaurant", "Spa", "Gym", "Room Service"],
  "roomTypes": [
    {
      "type": "Deluxe Room",
      "description": "Spacious room with city view",
      "price": 3500,
      "capacity": 2,
      "available": 10
    },
    {
      "type": "Premium Suite",
      "description": "Luxury suite with Ganges view",
      "price": 7500,
      "capacity": 3,
      "available": 5
    }
  ],
  "checkInTime": "14:00",
  "checkOutTime": "11:00",
  "policies": {
    "cancellation": "Free cancellation up to 24 hours before check-in",
    "childPolicy": "Children below 5 years stay free",
    "petPolicy": "Pets not allowed"
  }
}
```

### Get All Hotels (Public)
```http
GET {{baseUrl}}/hotels?city=Varanasi&page=1&limit=10
```

### Get Hotel by ID
```http
GET {{baseUrl}}/hotels/{{hotelId}}
```

### Update Hotel (Hotel Owner)
```http
PATCH {{baseUrl}}/hotels/{{hotelId}}
Authorization: Bearer {{hotelOwnerToken}}
Content-Type: application/json

{
  "roomTypes": [
    {
      "type": "Deluxe Room",
      "description": "Updated description",
      "price": 4000,
      "capacity": 2,
      "available": 8
    }
  ]
}
```

### Approve Hotel (Admin)
```http
PATCH {{baseUrl}}/hotels/admin/{{hotelId}}/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "approved"
}
```

## 3. TOUR ENDPOINTS

### Create Tour (Hotel Owner)
```http
POST {{baseUrl}}/tours
Authorization: Bearer {{hotelOwnerToken}}
Content-Type: application/json

{
  "title": "Varanasi Spiritual Tour - 3 Days",
  "description": "Experience the spiritual essence of Varanasi with temple visits and Ganga Aarti",
  "images": [
    "https://example.com/tour1.jpg",
    "https://example.com/tour2.jpg"
  ],
  "destination": "Varanasi",
  "duration": {
    "days": 3,
    "nights": 2
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival and Ganga Aarti",
      "description": "Pick up from airport/station, hotel check-in, evening Ganga Aarti",
      "activities": ["Hotel Check-in", "Dashashwamedh Ghat Visit", "Ganga Aarti Ceremony"]
    },
    {
      "day": 2,
      "title": "Temple Tour and Boat Ride",
      "description": "Early morning boat ride and temple visits",
      "activities": ["Sunrise Boat Ride", "Kashi Vishwanath Temple", "Sankat Mochan Temple", "Sarnath Visit"]
    },
    {
      "day": 3,
      "title": "Local Markets and Departure",
      "description": "Shopping and departure",
      "activities": ["Silk Market Visit", "Local Breakfast", "Departure"]
    }
  ],
  "price": {
    "perPerson": 8500,
    "child": 5000
  },
  "inclusions": [
    "2 nights accommodation",
    "Daily breakfast",
    "All transfers",
    "Guide services",
    "Boat ride",
    "Entry tickets"
  ],
  "exclusions": [
    "Lunch and dinner",
    "Personal expenses",
    "Travel insurance"
  ],
  "availableDates": [
    {
      "startDate": "2026-01-15",
      "endDate": "2026-01-17",
      "availableSeats": 20
    },
    {
      "startDate": "2026-02-01",
      "endDate": "2026-02-03",
      "availableSeats": 25
    }
  ],
  "maxGroupSize": 30,
  "difficulty": "easy"
}
```

### Get All Tours (Public)
```http
GET {{baseUrl}}/tours?destination=Varanasi&minPrice=5000&maxPrice=15000
```

## 4. BOOKING ENDPOINTS

### Create Hotel Booking (Customer)
```http
POST {{baseUrl}}/bookings
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "bookingType": "hotel",
  "hotel": "{{hotelId}}",
  "roomType": "Deluxe Room",
  "numberOfRooms": 2,
  "checkInDate": "2026-01-20",
  "checkOutDate": "2026-01-23",
  "totalAmount": 21000,
  "guestDetails": {
    "primaryGuest": {
      "name": "Raj Kumar",
      "email": "raj@customer.com",
      "phone": "9876543210"
    },
    "additionalGuests": [
      { "name": "Priya Kumar", "age": 28 },
      { "name": "Aarav Kumar", "age": 5 }
    ]
  },
  "specialRequests": "Need early check-in and extra bed for child"
}
```

### Create Tour Booking (Customer)
```http
POST {{baseUrl}}/bookings
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "bookingType": "tour",
  "tour": "{{tourId}}",
  "tourDate": "2026-01-15",
  "numberOfAdults": 2,
  "numberOfChildren": 1,
  "totalAmount": 22000,
  "guestDetails": {
    "primaryGuest": {
      "name": "Raj Kumar",
      "email": "raj@customer.com",
      "phone": "9876543210"
    },
    "additionalGuests": [
      { "name": "Priya Kumar", "age": 28 },
      { "name": "Aarav Kumar", "age": 5 }
    ]
  }
}
```

### Get My Bookings (Customer)
```http
GET {{baseUrl}}/bookings/my-bookings?status=confirmed
Authorization: Bearer {{customerToken}}
```

### Cancel Booking (Customer)
```http
PATCH {{baseUrl}}/bookings/{{bookingId}}/cancel
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "cancellationReason": "Change of plans due to emergency"
}
```

## 5. PAYMENT ENDPOINTS

### Create Payment (Customer)
```http
POST {{baseUrl}}/payments
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "bookingId": "{{bookingId}}",
  "amount": 21000,
  "paymentMethod": "upi",
  "transactionId": "TXN20250115123456"
}
```

### Get Payment Stats (Admin)
```http
GET {{baseUrl}}/payments/admin/stats
Authorization: Bearer {{adminToken}}
```

### Process Refund (Admin)
```http
POST {{baseUrl}}/payments/admin/{{paymentId}}/refund
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "refundAmount": 21000,
  "refundReason": "Booking cancelled by customer, eligible for full refund"
}
```

## 6. SUPPORT ENDPOINTS

### Create Support Ticket
```http
POST {{baseUrl}}/support
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "subject": "Issue with payment",
  "description": "I made payment but booking status not updated",
  "category": "payment",
  "relatedBooking": "{{bookingId}}"
}
```

### Add Message to Ticket
```http
POST {{baseUrl}}/support/{{ticketId}}/message
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "message": "I have attached the payment screenshot",
  "attachments": ["https://example.com/payment-screenshot.jpg"]
}
```

### Get All Tickets (Admin)
```http
GET {{baseUrl}}/support/admin/all?status=open&priority=high
Authorization: Bearer {{adminToken}}
```

### Assign Ticket (Admin)
```http
PATCH {{baseUrl}}/support/admin/{{ticketId}}/assign
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "assignedTo": "{{adminUserId}}"
}
```

### Resolve Ticket (Admin)
```http
PATCH {{baseUrl}}/support/admin/{{ticketId}}/resolve
Authorization: Bearer {{adminToken}}
```

## Notes:
- Replace `{{baseUrl}}` with `http://localhost:5000/api/v1`
- Replace `{{accessToken}}`, `{{hotelId}}`, `{{tourId}}`, etc. with actual values
- All authenticated requests need `Authorization: Bearer <token>` header
