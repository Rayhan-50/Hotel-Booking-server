# Hotel Booking Platform – Backend

This is the **backend** of the Hotel Booking Platform. It provides secure RESTful APIs for managing hotel rooms, user bookings, and user reviews using **Node.js**, **Express.js**, and **MongoDB**.

---

## 🚀 Live URL

- **Client:** [https://hotel-booking-client-2f049.web.app/](https://hotel-booking-client-2f049.web.app/)
- **Server (API):** Hosted via Render/other service (add if deployed)

---

## ⚙️ Features

### 🏨 Room Management
- Fetch all rooms: `GET /rooms`
- Fetch single room by ID: `GET /rooms/:id`

### 🧾 Booking System
- Book a room: `POST /myBookings`
- View user's bookings by email: `GET /myBookings?email=user@example.com`
- Update a booking date: `PUT /myBookings/:id`
- Cancel a booking: `DELETE /myBookings/:id`

### ✍️ Review System
- Add a review: `POST /reviews`
- Get all reviews: `GET /reviews`

### 🌐 Root Route
- `GET /` – Returns "Modern Hotel Booking Platform"

---

## 🛠️ Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with MongoDB Atlas)
- **Other Packages:**
  - `cors`
  - `dotenv`
  - `mongodb`

---

## 📁 Project Structure

