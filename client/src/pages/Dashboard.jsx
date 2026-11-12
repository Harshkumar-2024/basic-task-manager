import React, { useEffect, useState,useCallback } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import { Search,Plus,Layers,Hourglass,CirclePlay,CircleCheck,TriangleAlert,Filter,ChevronDown,X } from 'lucide-react'
import { useAuth } from '../context/AuthContext';
import {getAllTask,createTask} from '../api/taskApi'
import TaskTable from '../components/dashboard/TaskTable';


const Dashboard = () => {

  const {user} = useAuth();
  
  const [tasks,setTasks] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: ''
  });

  const [showCreateModal,setShowCreateModal] = useState(false);

  const [newTask,setNewTask] = useState({title:'',description:'',priority:'low',status:'not started',dueDate:''});

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  
  const fetchTasks = useCallback(async() =>{
    try{
      setLoading(true);
      setError('');

      const response = await getAllTask();
      setTasks(response.data.tasks);

    }catch(error){
      setError(error.response?.data?.message || 'Failed to fetched tasks');
    }finally{
      setLoading(false);
    }
  },[filters]);

  useEffect(()=>{
    fetchTasks();
  },[filters]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const summaryItems = [
    {
        title: 'Total Tasks',
        count: tasks.length,
        icon: Layers,
        color: 'text-[var(--color-primary)]',
        bg: 'bg-slate-100',
        border: 'border-l-[var(--color-primary)]'
    },
    {
        title: 'Pending',
        count: tasks.filter(task => task.status === 'not started').length,
        icon: Hourglass,
        color: 'text-[var(--color-warning)]',
        bg: 'bg-amber-50',
        border: 'border-l-[var(--color-warning)]'
    },
    {
        title: 'In Progress',
        count: tasks.filter(task => task.status === 'in progress').length,
        icon: CirclePlay,
        color: 'text-[var(--color-info)]',
        bg: 'bg-blue-50',
        border: 'border-l-[var(--color-info)]'
    },
    {
        title: 'Completed',
        count: tasks.filter(task => task.status === 'completed').length,
        icon: CircleCheck,
        color: 'text-[var(--color-success)]',
        bg: 'bg-green-50',
        border: 'border-l-[var(--color-success)]'
    },
    {
        title: 'Overdue',
        count: tasks.filter(task =>task.dueDate && new Date(task.dueDate) < today && task.status !== 'completed').length,
        icon: TriangleAlert,
        color: 'text-[var(--color-danger)]',
        bg: 'bg-red-50',
        border: 'border-l-[var(--color-danger)]'
    }
  ];

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try{
      setCreating(true);
      setCreateError('');
      
      const taskData = {
        ...newTask,
        dueDate:newTask.dueDate||null
      };

      await createTask(taskData);

      setShowCreateModal(false);

      //Reset from for the next task
      setNewTask({title:'',description:'',priority:'low',status:'not started',dueDate:''});

      await fetchTasks();
    }catch(error){
      console.log('Create task error:',error.response?.data||error);

      setCreateError(error.response?.data?.message || 'Failed to create task');
    } finally{
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex">
        <Sidebar/>
        <div className="flex-1 flex-col ">
          {/* search bar header */}
          <div className="h-[72px] bg-white flex items-center justify-between px-8">

              {/* Search bar */}
              <div className='relative max-w-md'>
                <Search size={20} className='absolute left-3 top-1/2 -translate-y-2.5 text-[var(--color-muted)]'/>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                />
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    //src={user?.profilePic}
                  src={user?.profilePic ? `http://localhost:3000${user.profilePic}` : ''}
                  alt="profile" className='w-full h-full object-cover'
                  onLoad={() => console.log('Image loaded successfully')}
                  onError={(e) => console.log('Image failed:', e)}
                    />
                </div>

                <h1 className="font-semibold text-[var(--color-text)] whitespace-nowrap">{user?.fullname}</h1>
              </div>

          </div>
          {/* welcomeback section */}
          <div className="py-5 px-6  border border-[var(--color-border)] rounded-md mx-6 my-4 flex justify-between shadow-[var(--shadow-card)] ">
            {/* welcome message */}
            <div className="">
              <h1 className='text-3xl font-semibold text-[var(--color-text)]'>Welcome back,{user?.fullname}!</h1>
              <p className='py-2 text-md text-[var(--color-muted)]'>Manage,track and complete your tasks efficiently</p>
            </div>
            {/* create task button */}
            <div className=''>
              <button type='button' className='flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-sidebar-hover)] transition-all duration-200 shadow-sm whitespace-nowrap' onClick={()=>setShowCreateModal(true)}>
                <Plus size={20} />Create task</button>
            </div>
          </div>
          {/* summary section */}
          <div className='mx-6 my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>

              {summaryItems.map((item) => {
                  const Icon = item.icon;

                  return (
                      <div
                          key={item.title}
                          className={`flex items-center gap-3 p-4 bg-white border border-[var(--color-border)] border-l-4 ${item.border} rounded-xl shadow-[var(--shadow-card)]`}
                      >
                          <div className={`p-2.5 rounded-full ${item.bg}`}>
                              <Icon size={23} className={item.color} />
                          </div>

                          <div>
                              <h3 className='text-sm font-medium text-[var(--color-muted)] whitespace-nowrap'>
                                  {item.title}
                              </h3>

                              <p className='text-2xl font-bold text-[var(--color-text)] mt-1'>
                                  {loading?'...':item.count}
                              </p>
                          </div>
                      </div>
                  );
              })}

          </div>

          {/* All Tasks and Filter Section */}
          <div className="mx-6 mt-8 mb-4 flex items-center justify-between">

            {/* All Tasks */}
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">
                All Tasks
              </h2>

              <p className="text-sm text-[var(--color-muted)] mt-1">
                You have {tasks.length} tasks in total
              </p>
            </div>

            {/* Filter Section */}
            <div className="relative">

              <button
                type="button"
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] font-medium hover:bg-[var(--color-secondary)] transition-all duration-200"
              >
                <Filter size={18} />
                Filter By
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showFilter ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-[440px] max-w-[calc(100vw-3rem)] bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-dropdown)] p-4 z-20">

                  <div className="grid grid-cols-3 gap-3">

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-muted)] mb-2">
                        STATUS
                      </label>

                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full border border-[var(--color-border)] rounded-lg px-2 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="">All Status</option>
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-muted)] mb-2">
                        PRIORITY
                      </label>

                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        className="w-full border border-[var(--color-border)] rounded-lg px-2 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="med">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-muted)] mb-2">
                        DUE DATE
                      </label>

                      <select
                        value={filters.dueDate}
                        onChange={(e) => setFilters({...filters, dueDate: e.target.value})}
                        className="w-full border border-[var(--color-border)] rounded-lg px-2 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="">All Dates</option>
                        <option value="overdue">Overdue</option>
                        <option value="today">Today</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="none">No Due Date</option>
                      </select>
                    </div>

                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => setFilters({
                        status: '',
                        priority: '',
                        dueDate: ''
                      })}
                      className="text-sm text-[var(--color-accent)] font-medium hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

          <TaskTable tasks={tasks} onRefresh={fetchTasks}/>

          {/* Create Task Modal */}
          {showCreateModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                  <div className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-6">

                      {/* Modal Header */}
                      <div className="flex items-center justify-between mb-5">
                          <h2 className="text-xl font-semibold text-[var(--color-text)]">
                              Create New Task
                          </h2>

                          <button
                              type="button"
                              onClick={() => setShowCreateModal(false)}
                              className="p-2 rounded-lg hover:bg-[var(--color-secondary)]"
                          >
                              <X size={20} />
                          </button>
                      </div>

                      {/* Create Task Form */}
                      <form onSubmit={handleCreateTask} className="space-y-4">

                          {/* Title */}
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  Task Title
                              </label>

                              <input
                                  type="text"
                                  value={newTask.title}
                                  onChange={(e) => setNewTask({
                                      ...newTask,
                                      title: e.target.value
                                  })}
                                  placeholder="Enter task title"
                                  required
                                  className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                              />
                          </div>

                          {/* Description */}
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  Description <span className="text-[var(--color-muted)]">(Optional)</span>
                              </label>

                              <textarea
                                  value={newTask.description}
                                  onChange={(e) => setNewTask({
                                      ...newTask,
                                      description: e.target.value
                                  })}
                                  placeholder="Enter task description"
                                  rows={4}
                                  className="w-full max-h-40 overflow-y-auto border border-[var(--color-border)] rounded-lg p-3 outline-none focus:border-[var(--color-accent)] resize-y"
                              />
                          </div>

                          {/* Priority */}
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  Priority
                              </label>

                              <select
                                  value={newTask.priority}
                                  onChange={(e) => setNewTask({
                                      ...newTask,
                                      priority: e.target.value
                                  })}
                                  className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                              >
                                  <option value="low">Low</option>
                                  <option value="med">Medium</option>
                                  <option value="high">High</option>
                              </select>
                          </div>

                          {/* Status */}
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  Status
                              </label>

                              <select
                                  value={newTask.status}
                                  onChange={(e) => setNewTask({
                                      ...newTask,
                                      status: e.target.value
                                  })}
                                  className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                              >
                                  <option value="not started">Not Started</option>
                                  <option value="in progress">In Progress</option>
                                  <option value="completed">Completed</option>
                              </select>
                          </div>

                          {/* Due Date */}
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  Due Date <span className="text-[var(--color-muted)]">(Optional)</span>
                              </label>

                              <input
                                  type="date"
                                  value={newTask.dueDate}
                                  onChange={(e) => setNewTask({
                                      ...newTask,
                                      dueDate: e.target.value
                                  })}
                                  className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                              />
                          </div>

                          {/* Error Message */}
                          {createError && (
                              <p className="text-sm text-[var(--color-danger)]">
                                  {createError}
                              </p>
                          )}

                          {/* Buttons */}
                          <div className="flex justify-end gap-3 pt-3">

                              <button
                                  type="button"
                                  onClick={() => setShowCreateModal(false)}
                                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)]"
                              >
                                  Cancel
                              </button>

                              <button
                                  type="submit"
                                  disabled={creating}
                                  className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-sidebar-hover)] disabled:opacity-60"
                              >
                                  {creating ? 'Creating...' : 'Create Task'}
                              </button>

                          </div>

                      </form>
                  </div>
              </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default Dashboard
