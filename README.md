# MediQR - Medication Safety & Emergency App

## Overview
MediQR is a modern web application designed to help users manage their medical information, generate emergency QR codes, and trigger SOS alerts. Built with a mobile-first, responsive design, MediQR provides a seamless experience on both desktop and mobile devices. The app leverages a Node.js/Express backend with MongoDB and a React/Tailwind CSS frontend.

## Features
- **Medical Profile Management:** Securely store and update your medical details and emergency contacts.
- **QR Code Generation:** Instantly generate a QR code containing your medical info for emergency use.
- **SOS Alerts:** Trigger emergency alerts with location sharing and voice recognition.
- **Insurance Integration:** Manage and view insurance details.
- **Voice Recognition:** Activate SOS using voice commands for hands-free emergencies.
- **Mobile-First UI:** Modern, card-based, and responsive design for all devices.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Other:** Axios, React Icons, Toastify

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Riya-dudeja/medical-qr-app.git
   cd medical-qr-app
   ```
2. **Install dependencies:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the `server` folder with your MongoDB URI and any required secrets:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
4. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
5. **Start the frontend dev server:**
   ```bash
   cd ../client
   npm run dev
   ```
6. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Folder Structure
```
medical-qr-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── ...
└── README.md
```

## Deployment
- **Frontend:** Deploy on Vercel, Netlify, or similar static hosting.
- **Backend:** Deploy on Heroku, Render, or any Node.js-compatible cloud platform.
- **Database:** Use MongoDB Atlas for cloud database hosting.

## Troubleshooting
- **MongoDB Connection Errors:**
  - Ensure your MongoDB URI is correct and your IP is whitelisted in MongoDB Atlas.
  - Check network/firewall settings if running locally.
- **Port Conflicts:**
  - Make sure ports 5173 (frontend) and 5000 (backend) are available.
- **Environment Variables:**
  - Double-check `.env` values for typos or missing keys.

## License
MIT

## Author
Riya Dudeja

---
For questions or support, open an issue on GitHub or contact the author.
