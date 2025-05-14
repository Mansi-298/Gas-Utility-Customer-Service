# Gas Utility Service Portal

A full-stack MERN application for managing gas utility service requests. This application allows customers to submit and track service requests while providing customer support representatives with tools to manage and resolve these requests efficiently.

## Features

### Customer Portal
- Account management
- Submit service requests with file attachments
- Track request status and history
- Add comments to existing requests
- View and manage personal information

### Support Staff Portal
- View and manage all service requests
- Assign requests to support staff
- Update request status and priority
- Track resolution progress
- View customer information

### Technical Features
- JWT-based authentication
- Role-based access control
- File upload support
- Real-time status updates
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Project Structure

```
gas-utility-service/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main application component
│   └── package.json
│
├── server/                  # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gas-utility-service
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gas-utility-service
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

5. Start the development servers:

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm run dev
   ```

6. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Service Requests
- POST /api/service-requests - Create new request
- GET /api/service-requests/my-requests - Get user's requests
- GET /api/service-requests/all - Get all requests (admin/support)
- PATCH /api/service-requests/:id/status - Update request status
- PATCH /api/service-requests/:id/assign - Assign request to staff
- POST /api/service-requests/:id/comments - Add comment to request

## Technologies Used

### Frontend
- React with Vite
- Material-UI
- React Router
- Redux Toolkit
- Axios
- React Toastify
- Formik & Yup

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Morgan for logging

### 📸 Screenshots

> - Login / Sign up
  ![Image](https://github.com/user-attachments/assets/72de6bbf-b037-489e-b8a8-d1274f5a2f67)

  ![Image](https://github.com/user-attachments/assets/0313a16e-9afc-4342-815d-534f7e7a55ed)

> - Dashboard
  ![Image](https://github.com/user-attachments/assets/34135822-7a03-467d-a91c-49a6fbd77adc)

> - Sevice Requests
  ![Image](https://github.com/user-attachments/assets/b314fb33-44f4-410e-ae0a-aa6ca3d73376)

> - Create a new service requests
  ![Image](https://github.com/user-attachments/assets/44b0ca91-ad67-47a5-a6d0-660357551008)

> - Admin Dashboard
  ![Image](https://github.com/user-attachments/assets/cbcc8571-9005-4a29-9824-bb5252e315a3)

  ![Image](https://github.com/user-attachments/assets/6a8ad67e-1036-48d9-a084-a5c3f778258d)

> - Demo Video
  [▶️ Watch Demo Video on Google Drive](https://drive.google.com/file/d/1HKF7QFl-_pIMYpGtellWZR2n4whpQD5-/view?usp=sharing)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
