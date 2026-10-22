const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
 {
    fullname:{
        type:String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false,
    },
    profilePic:{
        type:String,
        default:'/default.jpg',
    },
    task:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Task',
        },
    ],  
 },
 {
    timestamps:true,
 }
);

const User = mongoose.model("User",userSchema);

module.exports = User;
