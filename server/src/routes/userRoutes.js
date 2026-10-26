const express = require('express');
const router = express.Router();

const { getMyProfile ,uploadProfilePic } = require('../controllers/userController');

const upload = require('../middleware/uploadProfilePic');

router.get('/me',getMyProfile);

router.post('/upload',upload.single('profilePic'),uploadProfilePic);

module.exports = router;