# TaskFlow - Setup Guide

This guide will help you set up and run the TaskFlow Todo Task Management Application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Environment Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session
SESSION_SECRET=your_session_secret_here

# Frontend URLs
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5173` (for frontend)
6. Copy the Client ID and Client Secret to your `.env` files

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/taskflow` as your connection string

### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in your backend `.env` file

## Running the Application

1. Start the backend server (in `/backend`):
```bash
npm run dev
```

2. Start the frontend server (in `/frontend`):
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Features

### Authentication
- Local registration and login
- Google OAuth integration
- JWT-based authentication
- Session management

### Task Management
- Create, read, update, delete tasks
- Task priorities (low, medium, high, urgent)
- Task status tracking (pending, in-progress, completed)
- Due dates and tags
- Task filtering and searching
- Real-time updates via WebSockets

### User Interface
- Responsive design with Tailwind CSS
- Modern, clean interface
- Toast notifications
- Loading states and error handling
- Task cards with quick actions

### Dashboard
- Task statistics overview
- Recent tasks display
- Quick action buttons
- Personalized greeting

### Additional Features
- User profile management
- Task sharing capabilities
- Real-time collaboration
- Mobile-responsive design

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Tasks
- `GET /api/tasks` - Get user tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/share` - Share task
- `DELETE /api/tasks/:id/share` - Unshare task
- `GET /api/tasks/stats` - Get task statistics

## Troubleshooting

### Common Issues

1. **Backend won't start**: Check MongoDB connection and environment variables
2. **Google OAuth not working**: Verify Google Client ID and redirect URIs
3. **Frontend can't connect**: Ensure backend is running and CORS is configured
4. **Real-time updates not working**: Check Socket.IO connection

### Port Conflicts
If you encounter port conflicts, you can change the ports in:
- Backend: Change `PORT` in `.env`
- Frontend: Use `npm run dev -- --port 3000` to specify a different port

## Development Commands

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if implemented)

### Frontend  
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use a production MongoDB database
3. Deploy to services like Heroku, Vercel, or Railway

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to services like Netlify, Vercel, or Cloudflare Pages
3. Update environment variables for production URLs

---

For additional help or questions, please refer to the documentation or create an issue in the repository. 