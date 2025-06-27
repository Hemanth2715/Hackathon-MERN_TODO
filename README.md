# TaskFlow - Modern Task Management Application

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-Latest-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🚀 A modern, feature-rich task management application built with the MERN stack</h3>
  <p>Streamline your workflow, boost productivity, and organize your life with TaskFlow's intuitive interface and powerful features.</p>
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **Multiple Login Options**: Email/password and Google OAuth integration
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Password Management**: Secure password hashing and reset functionality
- **Protected Routes**: Role-based access control

### 📝 Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Organization**: Categories, priorities, and status tracking
- **Advanced Filtering**: Search, filter by status, priority, and date
- **Sorting Options**: Multiple sorting criteria (date, priority, alphabetical)
- **Pagination**: Efficient data loading with pagination

### 🎨 User Experience
- **Modern UI/UX**: Clean, intuitive interface following SaaS design principles
- **Responsive Design**: Mobile-first approach, works on all devices
- **Real-time Updates**: Socket.io integration for live updates
- **Multiple View Modes**: Grid, list, and kanban board views
- **Dark/Light Theme**: Theme switching capability
- **Accessibility**: WCAG compliant design

### 🔧 Additional Features
- **Profile Management**: Update personal information and preferences
- **Account Settings**: Security settings and account management
- **Data Export**: Export tasks in various formats
- **Offline Support**: Progressive Web App (PWA) capabilities
- **Performance Optimized**: Lazy loading and code splitting

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful toast notifications
- **Firebase** - Authentication and real-time features
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **Socket.io** - Real-time communication
- **bcrypt** - Password hashing
- **Joi** - Data validation

### DevOps & Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Postman** - API testing
- **VS Code** - Development environment

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB** (v6.0.0 or higher)
- **Git** for version control

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/mugesh-rao/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start MongoDB service (if running locally)
# For Windows: net start MongoDB
# For macOS: brew services start mongodb/brew/mongodb-community
# For Linux: sudo systemctl start mongod
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskflow
MONGODB_TEST_URI=mongodb://localhost:27017/taskflow_test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Application Configuration
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### Production Mode

#### Build and Start Backend
```bash
cd backend
npm start
```

#### Build and Serve Frontend
```bash
cd frontend
npm run build
npm run preview
```

