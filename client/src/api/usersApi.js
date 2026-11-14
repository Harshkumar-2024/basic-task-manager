import api from './axios'

export const getCurrentUser=()=>{
    return api.get('/users/me');
}

export const uploadProfilePic = (formData) => {
    return api.post('/users/upload',formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};