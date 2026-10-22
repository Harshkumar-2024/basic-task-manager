const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req,res,next) =>{
    try{
        // Get token from cookie
        const token = req.cookies?.token;

        if(!token){
            return res.status(401).json({
                message: 'Authentication required',
            });
        }

        //Verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                message:'User no longer exists',
            });
        }

        // Attach user information to request
        req.user = user;

        next();

    }catch(error){
         if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError'
        ) {
            return res.status(401).json({
                message: 'Invalid or expired token',
            });
        }

        console.error('Authentication error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

module.exports = authMiddleware;