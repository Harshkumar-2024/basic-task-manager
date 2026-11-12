import api from "./axios";

const getTimezoneConfig = () => ({
    headers:{
        'X-Timezone':Intl.DateTimeFormat().resolvedOptions().timeZone
    }
});

export const getAllTask=(filter = {})=>{
    return api.get('/tasks',{...getTimezoneConfig(),params:filter});
}

export const getTaskById =(id)=>{
    return api.get(`/tasks/${id}`);
}

export const deleteTask =(id)=>{
    return api.delete(`/tasks/${id}`);
}

export const updateTask =(id,data)=>{
    return api.patch(`/tasks/${id}`,data,getTimezoneConfig());
}

export const createTask =(data)=>{
    return api.post('/tasks/create',data,getTimezoneConfig());
}



