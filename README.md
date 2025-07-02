# 🍽️ FoodBird API – Backend of The Online Food Order & Donation Platform

Welcome to **FoodBird**, a Node.js & Express.js backend powering an online food ordering and donation system. This backend enables users to order meals, donate excess food, and support community kitchens.

---

## 🚀 Features

- ✅ Secure REST API for food ordering and donation
- 🔒 Cookie & Token-based authentication
- 🧾 Logging with Morgan
- 🛡️ CORS-enabled API for frontend integration
- 🍃 Environment configuration using `.env`
- 🔥 Firebase Admin support (for notifications/auth etc.)
- ☁️ Deployable on **Vercel**

---
##📡 API Overview
Live URL: https://foodbird-server.vercel.app

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| `GET`  | `/orders`        | Fetch all orders                 |
| `POST` | `/order`         | Create a new food order          |
| `GET`  | `/donations`     | List all food donations          |
| `POST` | `/donate`        | Submit a food donation           |
| `POST` | `/auth/login`    | Authenticate user login          |
| `POST` | `/auth/register` | Register new user                |
| `GET`  | `/profile`       | Get user profile (requires auth) |


## 🛠️ Tech Stack

| Technology      | Usage                          |
|-----------------|--------------------------------|
| Node.js         | Backend runtime                |
| Express.js      | Server framework               |
| MongoDB         | Database for data persistence  |
| Firebase Admin  | Optional auth/notifications    |
| Morgan          | Logging HTTP requests          |
| Body-Parser     | Parsing JSON and form data     |
| Cookie-Parser   | Handling cookies               |
| CORS            | Cross-Origin Resource Sharing  |
| Dotenv          | Managing environment variables |
| Nodemon         | Auto-reload in dev             |

---

## 📁 Project Structure
/server
│
├── connectDb.js # MongoDB connection
├── index.js # App entry point
├── router.js # All API routes
├── .env # Environment variables
└── package.json # Project metadata and dependencies


---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rabiul3000/food-bird-version-2.git
cd food-bird-version-2
