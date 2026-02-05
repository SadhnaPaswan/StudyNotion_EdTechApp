# 🎓 StudyNotion — Full Stack EdTech Learning Platform

**StudyNotion** is a full-featured **Learning Management System (LMS)** where instructors can create and sell courses, and students can enroll, watch lectures, and track their learning progress — similar to platforms like **Udemy** or **Coursera**.

This project demonstrates a **production-level MERN stack application** with authentication, video hosting, secure payments, dashboards, and real-time course tracking.

---

## 🚀 Live Demo
https://study-notion-ed-tech-app-frontend.vercel.app/

---

## 🧠 Project Overview

StudyNotion provides a complete ecosystem for online education:

| Role | Capabilities |
|------|--------------|
| 👨‍🏫 Instructor | Create courses, upload videos, manage content, view analytics |
| 🧑‍🎓 Student | Purchase courses, watch lectures, track progress, review courses |

This platform focuses on **scalability, security, and real-world integrations**.

---

## ✨ Core Features

### 🔐 Authentication System
- JWT-based login/signup
- OTP email verification
- Password reset via email
- Role-based access (Student / Instructor)
- Protected routes using middleware

### 📚 Course Management
- Create, edit, and publish courses
- Organize content into **Sections & Subsections**
- Upload video lectures
- Instructor course dashboard

### 🎥 Media Handling
- Video uploads stored securely via **Cloudinary**

### 💳 Payment Integration
- Secure course purchase using **Razorpay**
- Enrollment confirmation email


### 📈 Learning Experience
- Track lecture completion
- Resume from last watched video
- View enrolled courses

### ⭐ Ratings & Reviews
- Students can rate and review courses
- Average rating calculation

### 📊 Dashboards

**Student Dashboard**
- Enrolled courses
- Learning progress

**Instructor Dashboard**
- Course management
- Performance analytics

### 📧 Email System
- OTP verification emails
- Password reset emails
- Course enrollment confirmation
- Payment success notifications

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Redux Toolkit
- Tailwind CSS


### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Third-Party Integrations

| Service | Purpose |
|---------|--------|
| Cloudinary | Video & media storage |
| Razorpay | Payment gateway |
| Nodemailer | Email services |

---

## 📂 Project Structure

### 🔹 Backend (Server)

```
Server
├── config        → DB, Cloudinary, Razorpay setup
├── controllers   → Business logic
├── models        → MongoDB schemas
├── routes        → API endpoints
├── middlewares   → Auth & protection
├── templates     → Email templates
└── utils         → Helper functions
```

### 🔹 Frontend (Client)

```
src
├── components    → UI & feature components
├── pages         → Route pages
├── slices        → Redux state slices
├── services      → API calls
├── hooks         → Custom hooks
└── data          → Static data files
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd StudyNotion
```

### 2️⃣ Backend Setup
```bash
cd Server
npm install
```

Create a `.env` file inside `Server`:

```
PORT=4000
MONGODB_URL=your_mongodb_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret

MAIL_USER=your_email
MAIL_PASS=your_password
```

Run backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ..
npm install
npm run dev
```

App runs at:
```
http://localhost:5173
```

---

## 🔒 Security Practices
- Password hashing
- JWT authentication
- Role-based authorization
- Protected backend routes
- Secure payment verification

---

## 📌 Future Enhancements
- Live classes integration  
- Certificate generation  
- Course recommendation engine  
- Admin panel  

---


## 👨‍💻 Author

**Rajan Kumar**  
Full Stack Developer  

---

## 📜 License
This project is developed for educational and portfolio purposes.
