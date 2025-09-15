# MediQR – Medication Safety & Emergency App

## Overview
**MediQR** is a modern, mobile-first web application that helps users securely manage medical information, generate emergency QR codes, and trigger SOS alerts. Designed for both desktop and mobile, it offers a seamless, responsive experience. The app features a **Node.js/Express backend with MongoDB** and a **React/Tailwind CSS frontend**.

---

## Key Features
- **Medical Profile Management:** Store and update medical details and emergency contacts securely.  
- **QR Code Generation:** Instantly create QR codes containing your medical info for emergencies.  
- **SOS Alerts:** Trigger emergency notifications with location sharing and voice recognition.  
- **Insurance Integration:** Manage and view insurance details in one place.  
- **Voice Recognition:** Hands-free SOS activation using voice commands.  
- **Responsive UI:** Modern, card-based, mobile-first design for all devices.  

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite  
- **Backend:** Node.js, Express, Mongoose  
- **Database:** MongoDB Atlas  
- **Other Libraries:** Axios, React Icons, Toastify  

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)  
- npm or yarn  
- MongoDB Atlas account (or local MongoDB)  

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Riya-dudeja/medical-qr-app.git
   cd medical-qr-app
**Install dependencies**

cd client
npm install
cd ../server
npm install


**Configure environment variables**
Create a .env file inside server/:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


**Start the backend server**

cd server
npm run dev


**Start the frontend dev server**

cd ../client
npm run dev


**Access the app**
Open http://localhost:5173
 in your browser.

**Folder Structure**
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

**Railway Deployment**
1. Connect GitHub Repo

Go to Railway
 → New Project → Deploy from GitHub

Select Riya-dudeja/medical-qr-app and branch main

Root directory: server

2. Add Environment Variables

Go to Settings → Variables and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Save changes

3. Deploy

Railway automatically deploys when you push to main.

To trigger manually, make a tiny commit:

git add README.md
git commit -m "Trigger Railway deploy"
git push origin main

4. Verify

Backend health check:

https://<your-app>.up.railway.app/api/health


Frontend:

https://<your-app>.up.railway.app/

Troubleshooting

MongoDB Connection Issues: Verify the MONGO_URI is correct and IP is whitelisted.

Port Conflicts: Ensure ports 5173 (frontend) and 5000 (backend) are free.

Environment Variables: Double-check .env values for typos or missing keys.

License

MIT

**Author**

Riya Dudeja

For questions or support, open an issue on GitHub or contact the author.