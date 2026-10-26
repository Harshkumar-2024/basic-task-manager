const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname,'../../uploads/profiles');

fs.mkdirSync(uploadDir,{recursive:true});

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,uploadDir);
    },

    filename:(req,file,cb) => {
        const filename = `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`;
        cb(null,filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1,
    },
});

module.exports = upload;