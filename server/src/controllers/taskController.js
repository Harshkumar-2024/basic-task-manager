const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// create a new task
const createTask = async(req,res)=>{
    try{
        const {title,description,priority,status,dueDate} = req.body;

        // Validate required fields
        if(!title || !priority){
            return res.status(400).json({
                message:'Title and priority are required'
            });
        }

       if (typeof title !== 'string' ||(description !== undefined && description !== null && typeof description !== 'string')) {
            return res.status(400).json({
                message: 'Invalid input types',
            });
        }

        const normalizedTitle = title.trim();

        if(!normalizedTitle){
            return res.status(400).json({
                message: 'Title cannot be empty',
            });
        }

        // Validate priority
        const validPriorities = ['low', 'med', 'high'];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: 'Priority must be low, med, or high',
            });
        }

        // Validate status if provided
        const validStatuses = ['not started', 'in progress', 'completed'];

        if (status !== undefined  && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid task status',
            });
        }

         //  Validate due date if provided
        let parsedDueDate;

        if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
            parsedDueDate = new Date(dueDate);

            if (Number.isNaN(parsedDueDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid due date',
                });
            }
        }

        // Create the task for the logged-in user
        const task = await Task.create({
            title: normalizedTitle,
            description: description?.trim() || null,
            priority,
            status: status || 'not started',
            dueDate: parsedDueDate || null,
            user: req.user._id,
        });


        // Add task reference to the user's tasks array
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { tasks: task._id },
        });

        return res.status(201).json({
            message: 'Task created successfully',
            task,
        });

    }catch(error){
         console.error('Create task error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

// Partially update an existing task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, dueDate } = req.body;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            });
        }

        const allowedFields = [
            'title',
            'description',
            'priority',
            'status',
            'dueDate',
        ];

        const receivedFields = Object.keys(req.body);

        if (receivedFields.length === 0) {
            return res.status(400).json({
                message: 'Provide at least one field to update',
            });
        }

        const hasInvalidField = receivedFields.some(
            (field) => !allowedFields.includes(field)
        );

        if (hasInvalidField) {
            return res.status(400).json({
                message: 'Request contains an unsupported field',
            });
        }

        // Find only a task owned by the logged-in user
        const task = await Task.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    message: 'Title must be a non-empty string',
                });
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            if (
                description !== null &&
                typeof description !== 'string'
            ) {
                return res.status(400).json({
                    message: 'Description must be a string or null',
                });
            }

            task.description = description?.trim() || null;
        }

        if (priority !== undefined) {
            const validPriorities = ['low', 'med', 'high'];

            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    message: 'Priority must be low, med, or high',
                });
            }

            task.priority = priority;
        }

        if (status !== undefined) {
            const validStatuses = [
                'not started',
                'in progress',
                'completed',
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid task status',
                });
            }

            task.status = status;
        }

        if (dueDate !== undefined) {
            if (dueDate === null || dueDate === '') {
                task.dueDate = null;
            } else {
                if (typeof dueDate !== 'string') {
                    return res.status(400).json({
                        message: 'Due date must be a string or null',
                    });
                }

                const parsedDueDate = new Date(dueDate);

                if (Number.isNaN(parsedDueDate.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid due date',
                    });
                }

                task.dueDate = parsedDueDate;
            }
        }

        // Save the changes
        await task.save();

        return res.status(200).json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        console.error('Update task error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

// delete a task
const deleteTask = async(req,res)=>{
    try{
        const {id} = req.params;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            });
        }

         // Find only a task owned by the logged-in user
        const task = await Task.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

       await task.deleteOne();

        // Remove the task reference from the user's tasks array
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { tasks: task._id } }
        );

        return res.status(200).json({
            message:"Task deleted successfully",
        });

    }catch(error){
        console.log('Delete task error:',error.message);

        return res.status(500).json({
            message:'Something went wrong',
        })
    }
};

// Get all tasks belonging to the logged user
const getTasks = async (req,res)=>{
    try{
        const tasks = await Task.find({
            user:req.user._id,
        }).sort({createdAt:-1});

        return res.status(200).json({
            message:'Tasks fetched successfully',
            count:tasks.length,
            tasks,
        });

    }catch(error){
        console.log('Get tasks error:',error.message);
        return res.status(500).json({
            message:'Something went wrong',
        });
    }
}

// Get one task by ID
const getTaskById = async(req,res)=>{
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:'Invalid task ID',
            });
        }

        const task = await Task.findOne({
            _id:id,
            user:req.user._id,
        });

        if(!task){
            return res.status(404).json({
                message:'Task not found',
            });
        }

        return res.status(200).json({
            message:'Task fetched successfully',
            task,
        });

    }catch(error){
        console.log('Get task error:',error.message);

        return res.status(500).json({
            message:'Something went wrong',
        });
    }
}

module.exports = {createTask, updateTask,deleteTask ,getTasks ,getTaskById};