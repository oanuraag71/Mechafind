# Mechafind

Mechafind is a full-stack web application that helps users find nearby mechanics, explore mechanic profiles, and raise vehicle service requests through a simple online platform.

## Features

- User registration and login
- Browse available mechanics
- View detailed mechanic profiles
- Send service requests with vehicle details and issue description
- User dashboard for managing requests
- Mechanic dashboard for handling assigned work
- REST API-based backend with authentication and request handling

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- JWT Authentication
- REST APIs

### Database
- MongoDB
- Mongoose

## Project Structure

```bash
Mechafind/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Main Modules

### Authentication
Handles user registration and login.

### Mechanics
Displays mechanic list, profiles, and mechanic-related data.

### Requests
Allows users to create service requests and mechanics to manage them.

## Main Pages

- Home Page
- Login Page
- Register Page
- Mechanics Page
- Mechanic Profile Page
- User Dashboard
- Mechanic Dashboard

## Installation

### Clone the repository
```bash
git clone https://github.com/oanuraag71/Mechafind.git
cd Mechafind
```

### Backend setup
```bash
cd backend
npm install
npm start
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Future Enhancements

- Real-time service request updates
- Live mechanic tracking
- Payment integration
- Admin dashboard
- Deployment on cloud platforms

## Author

Anurag
