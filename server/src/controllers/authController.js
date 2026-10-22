const bcrypt = require('bcrypt');
const User = require('../models/User');
const validator = require('validator');
const generateToken = require('../utils/generateToken');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // 1. Validate required fields
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        if (typeof fullname !== 'string' || typeof email !== 'string' ||typeof password !== 'string') {
            return res.status(400).json({
                message: 'Invalid input types',
            });
        }

        const normalizedName = fullname.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            return res.status(400).json({
                message: 'Full name cannot be empty',
            });
        }

        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
            });
        }

        // 2. Check whether the email already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered',
            });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Create the user
        const user = await User.create({
            fullname: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge:24*60*60*1000,
            path:'/',
        });

        return res.status(201).json({
            message: 'User registered successfully',
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email is already registered',
            });
        }

        console.error('Registration error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

// Login user
const loginUser = async(req,res) =>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:'Email and password are required',
            });
        }

        if (typeof email !== 'string' ||
            typeof password !== 'string') {
            return res.status(400).json({
                message: 'Invalid input',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address',
            });
        }

        const user = await User.findOne({
            email:normalizedEmail,
        }).select('+password');

        if(!user){
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

         if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge:24*60*60*1000,
            path:'/',
        });

        return res.status(200).json({message:'Login successful'})


    }catch(error){
        console.log('Login error:',error.message);
        
        return res.status(500).json({
            message:'Something went wrong',
        });
    }
};

// Logout user

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};


module.exports = { registerUser , loginUser , logoutUser };
