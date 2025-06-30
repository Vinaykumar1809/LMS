# 📘 Learning Management System (LMS)

An educational web application that allows administrators, instructors, and students to manage courses, assignments, quizzes, and progress tracking.

## 🛠️ Table of Contents

- [About the Project](#about-the-project)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Starting the Development Server](#starting-the-development-server)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## About the Project

This LMS enables educators to create interactive courses, quizzes, and manage student progress seamlessly in a responsive React application backed by a RESTful API. It supports role-based access for Admins, Instructors, and Students.

---

## Features

- ✅ User authentication with **Admin**, **Instructor**, and **Student** roles  
- ✅ Course creation, editing, and deletion  
- ✅ Assignment and quiz management  
- ✅ Student enrollment and progress tracking  
- ✅ Responsive and mobile-friendly design  
- ✅ Dashboard with role-based content  
- ✅ Notifications and reminders  

---

## Tech Stack

- **Frontend**: React, React Router, Redux  
- **Backend**: Node.js, Express.js, MongoDB  
- **Authentication**: JWT (JSON Web Tokens)  
- **Styling**: Tailwind CSS  
- **Deployment**:  
  - Frontend: [Netlify](https://nexthorizonlearn.netlify.app/)  
  - Backend: Cloud instance (e.g. Render/Heroku)

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Vinaykumar1809/LMS.git
cd LMS
```

2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   
   cd ../frontend
   npm install

### Starting the Development Server

Start the backend:

```bash
  cd backend
  npm run dev
```

Then start the frontend:

```bash
cd ../frontend
npm start
```

### Configuration

In the backend folder, create a .env file:
```bash
PORT=5000
MONGODB_URL=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=http://localhost:3000
```

Add similar .env if needed for the frontend (for example, public environment variables).

### Usage

- Admin: View and manage users, courses, subscriptions.
- 
- Student: Enroll in courses, track progress, download certificates.

 ### Project Structure
 ```bash
LMS/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── slices/
│   │   └── App.js
│   └── public/
└── README.md
```

### Contact

- GitHub: Vinaykumar1809

- Live Site:[ (https//:nexthorizonlearn.netlify.app)](https://nexthorizonlearn.netlify.app/)


