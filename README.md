# Perla's - Modern Food Ordering & Restaurant Management System

Perla's is a full-featured, modern web application designed for a premium dining experience. It allows customers to browse a rich menu, place orders for pickup or delivery, book tables, and manage their account with real-time updates.

## 🚀 Overview

This project is built with a focus on speed, aesthetics, and user experience. It leverages the power of **React** and **Vite** for a snappy frontend, **Tailwind CSS** for a premium design system, and **Firebase** for robust backend services including authentication and real-time database management.

## ✨ Key Features

- **Dynamic Menu**: Categorized menu with real-time cart management.
- **Table Booking**: Easy-to-use table reservation system.
- **Checkout & Payments**: Secure checkout flow with support for **Paystack** and **Stripe**.
- **Delivery Services**: Integrated location services for delivery address selection and tracking.
- **User Accounts**: Personalized experience with order history, saved addresses, and profile management.
- **Real-time Updates**: Order status and cart synchronization across devices using Firestore.
- **Premium UI/UX**: Smooth transitions, responsive design, and optimized image loading.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router 7.
- **Backend/Database**: Firebase (Authentication, Firestore).
- **Payment Integration**: Paystack, Stripe.
- **Maps & Location**: Google Maps API, Leaflet, React Leaflet.
- **Icons**: React Icons (Fa, Io, etc.).
- **Animation**: Framer Motion / React Transition Group.

## 📦 Project Structure

```text
src/
├── components/     # Reusable UI components (Auth, Menu, Checkout, etc.)
├── contexts/       # React Context providers (Auth, Firestore/Cart)
├── firebase.js     # Firebase configuration and initialization
├── hooks/          # Custom React hooks (Image preloading, etc.)
├── pages/          # Full page components (Home, Menu, Checkout, Login)
├── services/       # Service layer for external APIs (Firestore, Stripe)
└── utils/          # Helper functions and constants
```

## 🔧 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Perla-s
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add your Firebase and payment provider keys (refer to `.env.example`).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📋 Ongoing Work & Known Issues

- **Payment Redirect**: We are currently resolving an issue where the checkout process redirects to the menu unexpectedly. This is due to a state mismatch between local and server-side cart management.
- **Location Services**: Full integration of Google Maps for precise delivery tracking is in progress.

---
© 2026 Perla's Restaurant. All rights reserved.
