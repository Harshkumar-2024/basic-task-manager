const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

const parseDueDate = require('../utils/parseDueDate');
const { DateTime } = require('luxon');

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

        // Parse due date using the client's timezone
        const timezone = req.get('X-Timezone') || 'UTC';

        const result = parseDueDate(dueDate, timezone);

        if (!result.valid) {
            return res.status(400).json({
                message: result.message || 'Invalid due date',
            });
        }

        const parsedDueDate = result.date;

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

// Search tasks by title
const searchTasks = async (req, res) => {
    try {
        const { query } = req.query;

        // Validate search query
        if (!query || !query.trim()) {
            return res.status(200).json({
                message: 'Please enter a search query',
                count: 0,
                tasks: [],
                suggestions: [],
            });
        }

        // Escape special regex characters
        const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Search only tasks belonging to the logged-in user
        const tasks = await Task.find({
            user: req.user._id,
            title: { $regex: escapedQuery, $options: 'i' },
        }).sort({
            createdAt: -1,
        });

        // Return first 5 task titles as suggestions
        const suggestions = tasks.slice(0, 5).map(task => ({
            _id: task._id,
            title: task.title,
        }));

        return res.status(200).json({
            message: 'Tasks searched successfully',
            count: tasks.length,
            tasks,
            suggestions,
        });

    } catch (error) {
        console.log('Search tasks error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong while searching tasks',
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
            const timezone = req.get('X-Timezone') || 'UTC';

            const result = parseDueDate(dueDate, timezone);

            if (!result.valid) {
                return res.status(400).json({
                    message: result.message || 'Invalid due date',
                });
            }

            task.dueDate = result.date;
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
        const {status,priority,dueDate} = req.query;
        const timezone = req.get('X-Timezone') || 'UTC';

        //validate timezone
        const now = DateTime.now().setZone(timezone);

        if(!now.isValid){
            return res.status(400).json({message:'Invalid timezone',});
        }

        // Start by fetching only the logged in user's tasks
        const filter = {
            user:req.user._id,
        };

        if(status){
            const allowedStatuses = ['not started','in progress','completed'];

            if(!allowedStatuses.includes(status)){
                return res.status(400).json({
                    message:'Invalid status value',
                    allowedValues:allowedStatuses,
                });
            }

            filter.status = status;

        }

         // Validate and apply priority filter
        if (priority) {
            const allowedPriorities = ['low', 'med', 'high'];

            if (!allowedPriorities.includes(priority)) {
                return res.status(400).json({
                message: 'Invalid priority value',
                allowedValues: allowedPriorities,
                });
            }

            filter.priority = priority;
        }

        // Filter by due date
        if(dueDate !== undefined){
            const allowedDueDateFilters = ['overdue','today','upcoming','none',];

            if(!allowedDueDateFilters.includes(dueDate)){
                return res.status(400).json({
                    message:'Invalid dueDate filter',
                    allowedValues:allowedDueDateFilters,
                });
            }

            const startOfToday = now.startOf('day').toUTC().toJSDate();

            const startOfTomorrow = now.startOf('day').plus({day:1}).toUTC().toJSDate();

            if (dueDate === 'none') {
                filter.$or = [
                    { dueDate: null },
                    { dueDate: { $exists: false } },
                ];
            }

            if (dueDate === 'today') {
                filter.dueDate = {
                    $gte: startOfToday,
                    $lt: startOfTomorrow,
                };
            }

            if (dueDate === 'upcoming') {
                filter.dueDate = {
                    $gte: startOfTomorrow,
                };
            }

            if (dueDate === 'overdue') {
                filter.dueDate = {
                    $lt: startOfToday,
                    $ne: null,
                };

                filter.status = {...(filter.status ? {$eq:filter.status }:{}), $ne:'completed', };
            
            }
        
        }

        const tasks = await Task.find(filter).sort({
            createdAt:-1,
        });

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

module.exports = {createTask, updateTask,deleteTask ,getTasks ,getTaskById,searchTasks};