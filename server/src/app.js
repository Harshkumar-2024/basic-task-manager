const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data (optional)
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

app.use('/uploads',express.static(path.join(__dirname,'../uploads')))
app.use(express.static(path.join(__dirname,'public')));

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