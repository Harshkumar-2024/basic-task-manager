const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,'Task title is required'],
            trim:true,
        },
        description:{
            type:String,
            trim:true,
            default:null,
        },
        priority:{
            type:String,
            enum:["low","med","high"],
            required:[true,'Task priority is required'],
        },
        status:{
            type:String,
            enum:["not started","in progress","complted"],
            required:[true,"Task status is required"],
            default:'not started',
        },
        dueDate:{
            type:Date,
            default:null,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    },
    {
        timestamps:true,
    }
);

const Task = mongoose.model("Task",taskSchema);

module.exports = Task;