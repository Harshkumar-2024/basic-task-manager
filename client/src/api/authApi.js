import api from './axios'

export const registerUser = (userData)=>{
    return api.post('/auth/register',userData);
}

export const loginUser = (credential) =>{
    return api.post('/auth/login',credential);
}

export const logoutUser = () =>{
    return api.post('/auth/logout');
}