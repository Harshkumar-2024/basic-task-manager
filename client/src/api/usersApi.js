import api from './axios'

export const getCurrentUser=()=>{
    return api.get('/users/me');
}