import api from "./axios";

const getTimezoneConfig = () => ({
    headers:{
        'X-Timezone':Intl.DateTimeFormat().resolvedOptions().timeZone
    }
});

export const getAllTask=(filter = {})=>{
    const params = {};

    if(filter.status) params.status = filter.status;
    if(filter.priority) params.priority = filter.priority;
    if(filter.dueDate) params.dueDate = filter.dueDate;

    return api.get('/tasks',{...getTimezoneConfig(),params});
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

export const searchTasks = (query) =>{
    return api.get('/tasks/search',{params:{query}});
};



