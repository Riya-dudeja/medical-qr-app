# 🏥 MediQR - Smart Medical Emergency Assistant

<div align="center">

**Your Digital Life Saver - Instant Medical Information Access in Emergencies**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-blue?style=for-the-badge)](https://medical-qr-app.vercel.app/)
[![Backend API](https://img.shields.io/badge/🔌_API-Backend-green?style=for-the-badge)](https://medical-qr-app.onrender.com/)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 🚀 **What is MediQR?**

MediQR is a **life-saving web application** that transforms how emergency medical information is accessed. In critical moments, every second counts - MediQR ensures your vital medical data is instantly available to first responders through **QR codes**, **voice-activated SOS**, and **real-time emergency alerts**.

### 🎯 **Perfect For:**
- 👨‍⚕️ **Medical Professionals** - Quick patient info access
- 🚑 **Emergency Responders** - Instant medical history
- 👴 **Elderly Care** - Family emergency contacts
- 🏃‍♂️ **Athletes & Adventurers** - On-the-go safety
- 👨‍👩‍👧‍👦 **Families** - Complete household medical management

---

## ✨ **Key Features**

<table>
<tr>
<td align="center" width="33%">

### 📱 **Smart QR Codes**
Generate instant-access medical QR codes containing:
- Medical conditions & allergies
- Emergency contacts
- Insurance information
- Current medications

</td>
<td align="center" width="33%">

### 🚨 **Voice-Activated SOS**
Hands-free emergency activation:
- Voice command triggers
- GPS location sharing
- Automatic notifications
- Real-time alerts

</td>
<td align="center" width="33%">

### 🔒 **Secure & Private**
Your data is protected with:
- JWT authentication
- Encrypted storage
- GDPR compliance
- User-controlled sharing

</td>
</tr>
</table>

### 🌟 **Additional Features**
- 📋 **Medical Profile Management** - Comprehensive health records
- 🏥 **Insurance Integration** - Policy details and claims
- 📞 **Emergency Contacts** - Multiple contact management
- 🌍 **Location Services** - GPS-based emergency response
- 📱 **Mobile-First Design** - Optimized for all devices
- 🌙 **Offline Access** - Critical info available without internet

---

## 🖥️ **Live Application**

### 🌐 **Try It Now!**
**Frontend:** [https://medical-qr-app.vercel.app/](https://medical-qr-app.vercel.app/)  
**API Backend:** [https://medical-qr-app.onrender.com/](https://medical-qr-app.onrender.com/)

---

## 🛠️ **Tech Stack**

<div align="center">

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### **Deployment**
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 🚀 **Quick Start**

### **Option 1: Use the Live App** ⚡
Simply visit [https://medical-qr-app.vercel.app/](https://medical-qr-app.vercel.app/) and start using MediQR immediately!

### **Option 2: Local Development** 🛠️

```bash
# 1. Clone the repository
git clone https://github.com/Riya-dudeja/medical-qr-app.git
cd medical-qr-app

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and secrets

# 4. Start the development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### **Environment Setup** 🔧

Create `server/.env` with:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
# ... other variables as needed
```

---

## 📁 **Project Structure**

```
medical-qr-app/
├── 🎨 client/                 # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── context/          # React context providers
│   │   ├── services/         # API integration
│   │   └── assets/           # Static assets
│   └── public/               # Public files
├── 🔧 server/                # Node.js Backend
│   ├── controllers/          # Request handlers
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   └── config/              # Configuration files
└── 📚 docs/                 # Documentation
```

---

## 🎯 **Use Cases & User Stories**

### 🚑 **Emergency Scenario**
> *"Sarah has a severe allergic reaction. The paramedic scans her MediQR code on her phone and instantly sees she's allergic to penicillin, potentially saving her life."*

### 👴 **Elderly Care**
> *"Grandpa Joe falls while walking. His MediQR bracelet provides first responders with his medications, medical conditions, and emergency contacts within seconds."*

### 🏃‍♂️ **Sports & Adventure**
> *"During a hiking trip, Alex gets injured. Fellow hikers scan his MediQR code to contact his emergency contacts and inform rescue services about his medical conditions."*

---

## 🔒 **Security & Privacy**

- 🛡️ **JWT Authentication** - Secure user sessions
- 🔐 **Data Encryption** - All sensitive data encrypted
- 🌐 **HTTPS Only** - Secure data transmission
- 👤 **User Control** - You decide what to share
- 🗂️ **GDPR Compliant** - Privacy-first approach

---

## 🚀 **Deployment Architecture**

- **Frontend**: Deployed on Vercel for global CDN and instant loading
- **Backend**: Hosted on Render for scalable API performance  
- **Database**: MongoDB Atlas for secure, cloud-based data storage

---

## 📈 **Roadmap**

- [ ] 🔔 **Push Notifications** - Real-time emergency alerts
- [ ] 🗣️ **Multi-language Support** - Global accessibility
- [ ] ⌚ **Wearable Integration** - Smartwatch compatibility
- [ ] 🏥 **Healthcare Provider Portal** - Professional dashboard
- [ ] 📊 **Analytics Dashboard** - Usage insights and trends
- [ ] 🤖 **AI Health Assistant** - Intelligent recommendations

---

## 👥 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License

---

## 👩‍💻 **Author**

<div align="center">

**Riya Dudeja**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Riya-dudeja)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/riya-dudeja)

*"Building technology that saves lives, one QR code at a time."*

</div>

---

## 🆘 **Support**

- 📧 **Email**: [support@mediqr.app](mailto:support@mediqr.app)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Riya-dudeja/medical-qr-app/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Riya-dudeja/medical-qr-app/discussions)
- 📚 **Documentation**: [Wiki](https://github.com/Riya-dudeja/medical-qr-app/wiki)

---

<div align="center">

**⭐ Star this repository if MediQR helped you or could help others! ⭐**

*Made with ❤️ for emergency preparedness and medical safety*

</div>
