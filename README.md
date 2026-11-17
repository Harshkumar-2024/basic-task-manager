# Basic Task Manager

A full-stack task management application that helps users organize, track, and manage their daily tasks efficiently.

Users can create an account, manage their personal tasks, set priorities and due dates, track task progress, and manage their profile.

## Features

### Authentication
- User registration and login.
- JWT-based authentication using HTTP-only cookies.
- Secure password hashing with bcrypt.
- Protected routes for authenticated users.
- User logout functionality.

### Task Management
- Create, view, update, and delete tasks.
- Set task priorities: Low, Medium, and High.
- Track task status: Not Started, In Progress, and Completed.
- Add optional task descriptions and due dates.
- Search tasks by title.
- Filter tasks by status, priority, and due date.
- View task summaries and overdue tasks.

### User Profile
- View and manage user profile information.
- Upload and update profile pictures.
- Secure image storage using AWS S3.
- Private image access using presigned URLs.

### User Interface
- Responsive dashboard.
- Mobile-friendly navigation.
- Loading indicators and error handling.
- Interactive task management interface.

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

**Cloud Storage**
- AWS S3
- AWS SDK for JavaScript

## Project Structure

```text
basic-task-manager/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── scripts/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) database
- AWS account and an S3 bucket for profile image storage

### 1. Clone the repository

```bash
git clone https://github.com/Harshkumar-2024/basic-task-manager.git
cd basic-task-manager
```


### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Add the required configuration:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

Replace the example values with your own credentials.

**Important:** Never commit your `.env` file or expose your AWS credentials, JWT secret, or database connection string.

### 5. Run the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

The backend API runs at:

```text
http://localhost:3000
```

## Task Information

Each task supports the following fields:

| Field | Description |
|---|---|
| Title | Task name (required) |
| Description | Additional details (optional) |
| Priority | Low, Medium, or High |
| Status | Not Started, In Progress, or Completed |
| Due Date | Task deadline (optional) |

Tasks are associated with their respective users, ensuring users can manage their own tasks.

## Security

The application includes several basic security practices:

- Password hashing using bcrypt.
- JWT authentication with HTTP-only cookies.
- Protected backend routes.
- User-specific task access.
- Input validation on the backend.
- Restricted profile image types and file sizes.
- Private AWS S3 bucket with presigned image URLs.

## Future Improvements

Potential improvements for future versions:

- Task reminders and notifications.
- Task sorting and pagination.
- Improved analytics and productivity insights.
- Additional profile settings.
- Production deployment.

## Author

Developed as a full-stack development project to practice building a complete web application using the MERN stack and AWS S3.

---

**Basic Task Manager** – Stay organized. Track progress. Get things done.
