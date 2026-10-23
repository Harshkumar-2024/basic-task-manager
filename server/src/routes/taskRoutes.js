const express = require('express');
const router = express.Router();

const {createTask ,updateTask ,deleteTask ,getTasks ,getTaskById } = require('../controllers/taskController');

router.post('/create',createTask);

router.get('/',getTasks);

router.get('/:id',getTaskById);

router.patch('/:id',updateTask);

router.delete('/:id',deleteTask);

module.exports = router;