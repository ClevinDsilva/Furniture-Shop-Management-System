# 🪑 Furniture Shop Management System (Furniture Hub)

A full-featured **MERN Stack** web application for managing a furniture store. This system includes both **Admin** and **User** modules, providing a complete solution for handling products, orders, users, and shopping cart operations.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB (NoSQL)

---

## 📁 Project Structure

Furniture-Shop-Management-System/
├── backend/ # Node.js Express API
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── config/
├── frontend/ # React App for User
│ ├── components/
│ ├── pages/
│ ├── redux/
│ └── utils/
├── admin/ # React App for Admin Panel
│ ├── components/
│ ├── pages/
│ └── utils/
└── README.md # Project overview


---

## ✨ Features

### 👥 User Module
- User Registration & Login
- Browse Products
- Add to Cart
- Place Orders
- View Order History
- Manage Profile

### 🛠 Admin Module
- Admin Login
- Dashboard with Statistics
- Manage Products (Add, Update, Delete)
- Manage Users
- View and Update Order Status

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1️⃣ Clone the Repository

# bash
git clone https://github.com/ClevinDsilva/Furniture-Shop-Management-System.git
cd Furniture-Shop-Management-System
cd backend
npm install
Create a .env file and configure:
MONGO_URI=
JWT_SECRET=
PORT=
npm start


cd ../frontend
npm install
npm start

📦 API Overview (Backend)
/api/users/ – User registration and authentication

/api/products/ – CRUD operations for products

/api/orders/ – Place and manage orders

/api/admin/ – Admin operations

🙌 Acknowledgments
MongoDB

React + Redux Toolkit

Express.js

Tailwind CSS

JWT Authentication


[Clevin_Project_Final.pdf](https://github.com/user-attachments/files/20802947/Clevin_Project_Final.pdf)
