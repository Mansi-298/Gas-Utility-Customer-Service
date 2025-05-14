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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 