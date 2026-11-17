const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const allowedOrigins = [
    'http://localhost:5173',
    'https://basic-task-manager-nine.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data (optional)
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Basic Task Manager API is running');
});

// Routes
app.use('/auth',authRoutes);
app.use('/tasks',authMiddleware,taskRoutes);
app.use('/users',authMiddleware,userRoutes);

// app.get('/auth/me', authMiddleware, (req, res) => {
//     res.status(200).json({
//         message: 'Authenticated successfully',
//         user: {
//             id: req.user._id,
//             fullname: req.user.fullname,
//             email: req.user.email,
//         },
//     });
// });

module.exports = app;