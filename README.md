# 🏠 RentEase

**RentEase** is a full-stack Rental Management System designed to simplify and streamline rental operations for landlords and tenants. From property listings and tenant communication to secure rent payments and invoice generation, RentEase offers an end-to-end platform in a clean, modern interface.

---

## 👥 Project Contributors

- **Abhinav Giri**  
- **Nikhil Raj**  
- **Shakshi Singh**  
- **Abhinav Singh Rathor**

---

## 🚀 Features

### ✅ Tenant Features
- 🔍 Browse and search rental properties by location
- 📆 View property availability and book rentals
- 💬 Real-time chat with landlords
- 💳 Secure rent payments via Stripe
- 📄 View booking history and invoices

### ✅ Landlord Features
- 🏘️ Add, edit, and manage property listings
- 📸 Upload and store property images via Cloudinary
- 📬 Communicate directly with tenants
- 📈 Track bookings and earnings
- 📄 View payment records with invoice-style layout
- 🔐 Block or unblock tenants if necessary

### ✅ Admin Features
- 🧑‍💼 Manage all users (landlords & tenants)
- 📦 Monitor all property listings
- 💬 Review user interactions
- ⛔ Block or unblock user accounts
- 📊 Access platform-wide metrics and summaries

---

## 💡 Project Highlights

- 🔐 **Authentication**: Role-based login for Admin, Landlord, and Tenant with JWT-based session management.
- 💬 **Real-time Communication**: Messaging system between tenants and landlords with read receipts and avatars.
- 💳 **Payments**: Fully functional Stripe integration for rent payments, with payment metadata, session tracking, and confirmation-based booking.
- 🧾 **Invoices**: Auto-generated invoice-style payment viewer for both tenants and landlords.
- 📅 **Booking Flow**: Seamless booking system with calendar integration, date validations, and availability logic.
- ☁️ **Cloudinary Integration**: Property images and user avatars are uploaded and stored using Cloudinary, with URLs saved in the database.
- 📁 **Database**: PostgreSQL backend with normalized schema for users, properties, bookings, messages, and payments.

---

## 🧱 Tech Stack

### 🔹 Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Toastify
- React Datepicker

### 🔹 Backend
- Node.js
- Express.js
- PostgreSQL (with `pg` module)
- JWT for authentication
- Stripe SDK for payments
- Cloudinary SDK for image uploads
- Firebase Firestore (optional features like notifications/chat backup)

---

## 🔗 Setup Instructions

### 📁 Clone the Repository

```bash
git clone https://github.com/yourusername/rentease.git
cd rentease
```

Start the Frontend
cd frontend
npm install
npm start

Start the Backend
cd backend
npm install
nodemon server.js
