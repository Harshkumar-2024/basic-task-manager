const getMyProfile = async(req,res)=>{
    try{
        const user = req.user;

        return res.status(200).json({
            message:'Profile fetched successfully',
            user:{
                id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilePic:user.profilePic,
                createdAt:user.createdAt,
            },
        });

    }catch(error){
        console.log('Get profile error:',error.message);

        return res.status(500).json({
            message:'Something went wrong',
        });
    }
}

const uploadProfilePic = async(req,res) =>{
    try{
        if(!req.file){
            return res.status(400).json({
                message:'Please select a profile pictures',
            });
        }

        const user = req.user;

        const oldProfilePic = user.profilePic;

        // Save the new image path in MongoDB
        user.profilePic = `/uploads/profiles/${req.file.filename}`;

        await user.save();

        // Delete the previous uploaded image, if applicable
        if (oldProfilePic?.startsWith('/uploads/profiles/')) {
            const oldFilename = path.basename(oldProfilePic);
            const oldFilePath = path.join(__dirname,'../../uploads/profiles',oldFilename);

            if(oldFilename !== req.file.filename){
                await fs.unlink(oldFilePath).catch((error) => {
                    if(error.code !== 'ENOENT'){
                        console.error('Old profile pictures cleanup failed:',error.message);
                    }
                });
            }
        }

        return res.status(200).json({
            message:'Profile picture updated successfully',
            profilePic:user.profilePic,
        });

    }catch(error){
        // Remove the new file if the database update failed
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        console.error('Profile picture upload error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
}


module.exports = {getMyProfile , uploadProfilePic};