# 🧭 Employee Management System – Backend API

A secure, scalable, and auditable REST API for managing employees, designed with enterprise-ready features. Built using **Node.js**, **Express**, and **MongoDB**, with security, audit logging, and role-based access control at its core.

---

## 📌 Overview

This backend service powers an employee management platform, enabling:

- Secure **admin and employee authentication**
- Centralized **employee record management**
- Public employee profile viewing
- Audit trails for accountability
- RESTful API design, ready for frontend or mobile consumption

---

## ⚙️ Tech Stack

| Layer           | Technology                         |
|-----------------|-------------------------------------|
| Runtime         | Node.js (JavaScript)               |
| Framework       | Express.js                         |
| Database        | MongoDB (Mongoose ODM)             |
| Auth & Session  | JWT + HttpOnly Cookies             |
| Security        | Helmet, CORS, Rate Limiting        |
| Cache/Session   | Redis (via `createClient`)         |
| Utilities       | Morgan, Cookie-Parser              |
| Audit Logging   | Custom audit logs with metadata    |

---

## 🚀 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint           | Description                             | Auth Required |
|--------|--------------------|-----------------------------------------|---------------|
| POST   | `/login`           | Authenticate as employee or admin       | ✅            |
| GET    | `/me`              | Get current session user info           | ✅            |
| PUT    | `/me`              | Update current admin profile            | ✅ (Admin)     |
| POST   | `/me/logout=true`  | Logout authenticated user               | ✅            |

---

### 👤 Employee Self-Service (`/api/employees`)

| Method | Endpoint           | Description                             | Auth Required |
|--------|--------------------|-----------------------------------------|---------------|
| GET    | `/me`              | View own employee profile               | ✅ (Employee)  |
| PUT    | `/me`              | Update own employee data                | ✅ (Employee)  |
| POST   | `/me/logout=true`  | Logout employee                         | ✅            |

---

### 🛠️ Admin Management (`/api/admin/employees`)

| Method | Endpoint           | Description                             | Auth Required |
|--------|--------------------|-----------------------------------------|---------------|
| GET    | `/`                | List all employees                      | ✅ (Admin)     |
| GET    | `/:id`             | View details of one employee            | ✅ (Admin)     |
| POST   | `/`                | Create a new employee record            | ✅ (Admin)     |
| PUT    | `/:id`             | Update employee information             | ✅ (Admin)     |
| DELETE | `/:id`             | Delete an employee                      | ✅ (Admin)     |

---

### 🌍 Public Routes (`/api/public`)

| Method | Endpoint                  | Description                             | Auth Required |
|--------|---------------------------|-----------------------------------------|---------------|
| GET    | `/employee/:id`           | Public employee profile (business card) | ❌            |
| GET    | `/employees/search?q=...` | Search public profiles by query         | ❌            |

---

## 🛡️ Key Features

### ✅ Authentication & Session
- Cookie-based auth using `HttpOnly` tokens
- Role-based access control (Admin & Employee)
- Protected routes using custom `authMiddleware`

### 🧠 Audit Logging
Every login, logout, or profile update is logged with:
- Timestamp
- User role
- IP address (parsed using `utils/getClientIp.js`)
- User agent

### 🧰 Utility Modules
- **Redis**: Configured via `initRedis()` for scalable state/cache management
- **Client IP Detection**: Smart resolution using headers and socket fallback
- **Error Handling**: Centralized, formatted, developer-friendly

### 🔐 Security
- CORS with origin whitelisting
- Helmet for HTTP header hardening
- Express Rate Limiting (recommended with Redis for production)
- Input validation and sanitization (suggested with Joi or Zod)

---

## 🌡️ Health Check

| Method | Endpoint     | Description                  |
|--------|--------------|------------------------------|
| GET    | `/health`    | Returns `{ status: "ok" }`   |

---

## 🧪 Example Usage

**Login Request**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
````

**Public Employee Profile**

```http
GET /api/public/employee/64a2f6c78bf2d6a...
```

---

## 🏁 Getting Started

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**
   Create a `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
COOKIE_DOMAIN=localhost
```

3. **Run the Server**

```bash
npm run dev
```

---

## 🗃️ Project Structure

```
├── app.js
├── server.js
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── adminRoutes.js
│   └── publicRoutes.js
├── controllers/
├── middleware/
├── utils/
└── config/
```

---

## 👩‍💻 For Recruiters & Stakeholders

This project demonstrates:

* Clean architecture and modularity
* Security best practices (cookie auth, IP logs, role protection)
* Scalable architecture via Redis and centralized logs
* Designed for easy integration with modern frontends (Next.js, mobile apps)

If you're a tech lead or a recruiter, this codebase shows real-world readiness, with both developer ergonomics and production reliability in mind.

---

## 📬 Contact

Feel free to reach out for questions, collaboration, or a technical walkthrough.

## Favour Dumkwu
[LinkedIn](https://www.linkedin.com/in/favour-dumkwu) | [GitHub](https://github.com/dumkwufavour) | [Email](mailto:favourson71@gmail.com)
