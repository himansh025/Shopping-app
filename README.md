# 🛒 MyShop(E-Commerce Web App)

MyShop is a full-stack eCommerce web application built with **React**, **Node.js**, **MongoDB**, and **Razorpay** integration. It features **role-based access control (RBAC)** for **Users** and **Sellers**. Sellers can manage products, and users can browse, wishlist, add to cart, and place orders.

## 🚀 Live Demo
https://shopping-frontend-gamma.vercel.app/

## 👥 Roles

### 👤 User 
tesing email: root@example.com 
testing password :  root
- Browse all seller products
- Add products to wishlist
- Add products to cart
- Place orders
- Make payments via Razorpay
- View profile and order history

### 🛍️ Seller
tesing email : seller@example.com
testing password : SecurePass123
- Add, update, delete products (CRUD)
- View their own profile and listed products
- Manage orders from users

---

## 🔐 Authentication & Authorization

- JWT-based authentication & OAuth
- Role-based routes and permissions
- Protected routes for both sellers and users
- Conditional rendering based on role

---

## 💳 Payment Gateway

- **Razorpay** integrated for secure and fast transactions
- Handles order creation and payment status update

---

## 📦 Features

### 🧑‍💻 User
- ✅ Sign up / Log in
- 🛍 View products from various sellers
- ❤️ Wishlist management
- 🛒 Add to cart
- 📦 Place orders
- 💰 Make payments via Razorpay
- 🔐 Secure profile & order tracking

### 🧑‍🔧 Seller
- ✅ Sign up / Log in
- 📦 Add new products
- ✏️ Update product details
- ❌ Delete products
- 📄 View all listed products
- 🔐 Manage profile

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Redux Toolkit
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Payments
- Razorpay API

### Future Improvements
- Admin role to oversee all users and sellers
- Product reviews & ratings
- Pagination and filtering

