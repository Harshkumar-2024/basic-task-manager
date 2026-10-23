const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const authMiddleware = require('./middleware/authMiddleware');

const UserRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');


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
app.use('/auth',UserRoutes);
app.use('/tasks',authMiddleware,taskRoutes);

app.get('/auth/me', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Authenticated successfully',
        user: {
            id: req.user._id,
            fullname: req.user.fullname,
            email: req.user.email,
        },
    });
});

module.exports = app;