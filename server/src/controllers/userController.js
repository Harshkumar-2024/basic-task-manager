const {PutObjectCommand,DeleteObjectCommand,GetObjectCommand} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3 = require('../config/s3');

const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Get current user profile
const getMyProfile = async (req, res) => {
    try {
        const user = req.user;

        let profilePic = user.profilePic;

        // Generate a temporary URL for S3 images
        if (profilePic?.startsWith('profile-images/')) {
            profilePic = await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: bucketName,
                    Key: profilePic
                }),
                { expiresIn: 3600 }
            );
        }

        return res.status(200).json({
            message: 'Profile fetched successfully',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilePic,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.error('Get profile error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};


// Upload profile picture to S3
const uploadProfilePic = async (req, res) => {
    let newKey;
    let profileUpdated = false;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Please select a profile picture',
            });
        }

        const user = req.user;
        const oldProfilePic = user.profilePic;

        // Generate unique S3 object key
        const extensionMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };

        const extension = extensionMap[req.file.mimetype];

        newKey = `profile-images/${user._id}/${crypto.randomUUID()}${extension}`;

        // Upload image to S3
        await s3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: newKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
        );

        // Store S3 object key in MongoDB
        user.profilePic = newKey;

        await user.save();

        profileUpdated = true;

        // Delete previous S3 image after successful database update
        if (oldProfilePic?.startsWith('profile-images/') && oldProfilePic !== 'profile-images/default.jpg' &&oldProfilePic !== newKey) {
            try {
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: oldProfilePic
                    })
                );
            } catch (deleteError) {
                console.error(
                    'Old profile picture deletion failed:',
                    deleteError.message
                );
            }
        }

        // Generate temporary URL for frontend
        const profilePic = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: newKey
            }),
            { expiresIn: 3600 }
        );

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePic,
        });

    } catch (error) {

        // Remove newly uploaded image if database update failed
        if (newKey && !profileUpdated) {
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: newKey
                })
            ).catch(() => {});
        }

        console.error('Profile picture upload error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

module.exports = {
    getMyProfile,
    uploadProfilePic
};
