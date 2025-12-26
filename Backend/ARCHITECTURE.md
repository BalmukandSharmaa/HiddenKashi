# System Architecture Overview

## 🏗️ Three-Tier User System

```
┌─────────────────────────────────────────────────────────────────┐
│                     SWAGATAM KASHI BACKEND                      │
│                  Hotel & Tour Booking Platform                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         USER ROLES                               │
├─────────────────┬─────────────────────┬───────────────────────────┤
│   CUSTOMER      │   HOTEL OWNER       │      ADMIN               │
│   (Normal User) │   (Business User)   │   (Service Team)         │
├─────────────────┼─────────────────────┼───────────────────────────┤
│ • Browse Hotels │ • Create Hotels     │ • Approve/Reject         │
│ • Browse Tours  │ • Create Tours      │   Hotels & Tours         │
│ • Make Bookings │ • View Bookings     │ • View All Bookings      │
│ • Make Payments │ • Manage Listings   │ • Process Refunds        │
│ • Cancel Orders │ • Update Prices     │ • Handle Support         │
│ • Write Reviews │ • Update Available  │ • User Management        │
│ • Get Support   │ • Get Support       │ • View Analytics         │
│                 │                     │ • Resolve Issues         │
└─────────────────┴─────────────────────┴───────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE MODELS                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │    Hotel     │       │     Tour     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ • fullName   │◄──────┤ • owner      │       │ • owner      │
│ • email      │       │ • name       │       │ • title      │
│ • password   │       │ • address    │       │ • destination│
│ • phone      │       │ • roomTypes  │       │ • itinerary  │
│ • role       │       │ • amenities  │       │ • price      │
│ • isActive   │       │ • status     │       │ • duration   │
└──────────────┘       └──────────────┘       └──────────────┘
                              │                       │
                              └───────┬───────────────┘
                                      │
                              ┌───────▼───────┐
                              │   Booking     │
                              ├───────────────┤
                              │ • customer    │
                              │ • hotel/tour  │
                              │ • dates       │
                              │ • guests      │
                              │ • totalAmount │
                              │ • status      │
                              └───────┬───────┘
                                      │
                              ┌───────▼───────┐
                              │   Payment     │
                              ├───────────────┤
                              │ • booking     │
                              │ • amount      │
                              │ • method      │
                              │ • status      │
                              │ • refundInfo  │
                              └───────────────┘

┌──────────────────┐         ┌──────────────────┐
│ SupportTicket    │         │     Review       │
├──────────────────┤         ├──────────────────┤
│ • user           │         │ • user           │
│ • subject        │         │ • hotel/tour     │
│ • category       │         │ • rating         │
│ • status         │         │ • comment        │
│ • messages       │         │ • isApproved     │
│ • assignedTo     │         └──────────────────┘
└──────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      API FLOW EXAMPLES                           │
└─────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║                    CUSTOMER JOURNEY                            ║
╚═══════════════════════════════════════════════════════════════╝

1. REGISTRATION & LOGIN
   Customer → POST /users/register → System creates account
   Customer → POST /users/login → System returns JWT token

2. BROWSE & SEARCH
   Customer → GET /hotels?city=Varanasi → List of hotels
   Customer → GET /tours?destination=Varanasi → List of tours
   Customer → GET /hotels/:id → Hotel details

3. BOOKING
   Customer → POST /bookings → Create booking (status: pending)
   Customer → POST /payments → Process payment
   System → Update booking status to "confirmed"

4. AFTER BOOKING
   Customer → GET /bookings/my-bookings → View bookings
   Customer → PATCH /bookings/:id/cancel → Cancel if needed
   Customer → POST /support → Create ticket if issue

╔═══════════════════════════════════════════════════════════════╗
║                  HOTEL OWNER JOURNEY                           ║
╚═══════════════════════════════════════════════════════════════╝

1. REGISTRATION
   Owner → POST /users/register (role: hotel_owner)
   Provides: businessName, businessLicense

2. CREATE LISTINGS
   Owner → POST /hotels → Create hotel (status: pending)
   Owner → POST /tours → Create tour (status: pending)
   
3. WAIT FOR APPROVAL
   Admin reviews and approves/rejects

4. MANAGE BUSINESS
   Owner → GET /hotels/owner/my-hotels → View my hotels
   Owner → GET /bookings/owner/bookings → View bookings
   Owner → PATCH /hotels/:id → Update hotel details

╔═══════════════════════════════════════════════════════════════╗
║                     ADMIN JOURNEY                              ║
╚═══════════════════════════════════════════════════════════════╝

1. LISTING MANAGEMENT
   Admin → GET /hotels/admin/all?status=pending → Review hotels
   Admin → PATCH /hotels/admin/:id/status → Approve/Reject
   Admin → GET /tours/admin/all?status=pending → Review tours
   Admin → PATCH /tours/admin/:id/status → Approve/Reject

2. BOOKING & PAYMENT MANAGEMENT
   Admin → GET /bookings/admin/all → View all bookings
   Admin → GET /payments/admin/all → View all payments
   Admin → GET /payments/admin/stats → View statistics
   Admin → PATCH /bookings/admin/:id/status → Update status

3. REFUND PROCESSING
   Customer cancels → Booking status: cancelled
   Admin → POST /payments/admin/:id/refund → Process refund
   System → Update payment & booking status to "refunded"

4. SUPPORT TICKET HANDLING
   Admin → GET /support/admin/all → View all tickets
   Admin → PATCH /support/admin/:id/assign → Assign to team
   Admin → POST /support/:id/message → Reply to customer
   Admin → PATCH /support/admin/:id/resolve → Mark resolved

5. USER MANAGEMENT
   Admin → GET /users/all → View all users
   Admin → PATCH /users/:id/toggle-status → Activate/Deactivate


┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY FEATURES                              │
└─────────────────────────────────────────────────────────────────┘

✓ Password hashing with bcrypt (10 rounds)
✓ JWT tokens (Access + Refresh)
✓ HTTP-only secure cookies
✓ Role-based access control (RBAC)
✓ Token expiry (Access: 1d, Refresh: 10d)
✓ Protected routes with middleware
✓ Input validation on models
✓ Unique email constraint


┌─────────────────────────────────────────────────────────────────┐
│                  KEY FEATURES SUMMARY                            │
└─────────────────────────────────────────────────────────────────┘

✅ Multi-role authentication system
✅ Hotel listing with geospatial queries
✅ Tour package management with itineraries
✅ Complete booking workflow
✅ Payment processing & tracking
✅ Refund management by admin
✅ Support ticket system with messaging
✅ Review and rating system
✅ Approval workflow for listings
✅ User management by admin
✅ Pagination and filtering
✅ Status tracking for all entities


┌─────────────────────────────────────────────────────────────────┐
│                    NEXT ENHANCEMENTS                             │
└─────────────────────────────────────────────────────────────────┘

🔜 Payment gateway integration (Razorpay/Stripe)
🔜 File upload (Cloudinary/AWS S3)
🔜 Email notifications (Nodemailer)
🔜 SMS notifications
🔜 Real-time notifications (Socket.io)
🔜 Search with Elasticsearch
🔜 Caching with Redis
🔜 Rate limiting
🔜 API documentation (Swagger)
🔜 Unit & integration tests
🔜 Logging (Winston/Morgan)
🔜 Error tracking (Sentry)
