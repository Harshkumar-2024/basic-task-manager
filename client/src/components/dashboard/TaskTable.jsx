import {useState} from 'react'
import { Eye,PencilLine,Trash,X } from 'lucide-react'
import { updateTask,deleteTask } from '../../api/taskApi'

const TaskTable = ({tasks,onRefresh}) => {
    const taskHeading = ['Task','Description','Priority','Status','Due Date','Actions']

    const [selectedTask, setSelectedTask] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editTask,setEditTask] = useState({title:'',description:'',priority:'low',status:'not started',dueDate:''});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTaskItem, setDeleteTaskItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [saving,setSaving] = useState(false);
    const [error,setError] = useState('');

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setShowViewModal(true);
    };

    const formatDueDate = (date) => {
        if (!date) return 'No due date';

        const dateObj = new Date(date);

        if (Number.isNaN(dateObj.getTime())) return 'Invalid date';

        const parts = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }).formatToParts(dateObj);

        const day = parts.find(part => part.type === 'day').value;
        const month = parts.find(part => part.type === 'month').value;
        const year = parts.find(part => part.type === 'year').value;

        return `${day}-${month}-${year}`;
    };

    const getDateInputValue = (date) => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
    };

    const handleEditTask = (task) => {
        setEditTask({
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'low',
            status: task.status || 'not started',
            dueDate: getDateInputValue(task.dueDate)
        });

        setSelectedTask(task);
        setError('');
        setShowEditModal(true);
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            const updatedData = {
                ...editTask,
                dueDate: editTask.dueDate || null
            };

            await updateTask(selectedTask._id, updatedData);

            setShowEditModal(false);

            if (onRefresh) {
                await onRefresh();
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (task) => {
        setDeleteTaskItem(task);
        setShowDeleteModal(true);
    };

    const handleDeleteTask = async () => {
        try {
            setDeleting(true);
            setError('');

            await deleteTask(deleteTaskItem._id);

            setShowDeleteModal(false);
            setDeleteTaskItem(null);

            if (onRefresh) {
                await onRefresh();
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete task');
        } finally {
            setDeleting(false);
        }
    };

  return (
    <div>
       {/* Task container */}
        <div className="mb-3 bg-white rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-x-auto mx-2 sm:mx-5">

            {/* Header */}
            <div className="grid grid-cols-[1.2fr_1.8fr_0.8fr_1.1fr_1fr_0.9fr] min-w-[850px] rounded-lg bg-[var(--color-secondary)]">
            {taskHeading.map((item) => {
                return (
                <div
                    className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
                    key={item}
                >
                    {item}
                </div>
                )
            })}
            </div>

            {/* Main content */}
            <div className="mx-4 min-w-[850px]">

            {tasks.map((item) => {
                return (
                <div
                    key={item._id}
                    className="grid grid-cols-[1.2fr_1.8fr_0.8fr_1.1fr_1fr_0.9fr] items-center text-center border-b border-[var(--color-border)] py-4 hover:bg-[var(--color-secondary)]/60 transition-colors duration-200"
                >
                    <div className="px-3 text-sm font-medium text-[var(--color-text)]">
                    {item.title}
                    </div>

                    <div className="px-3 text-sm text-[var(--color-muted)] truncate">
                    {item.description || 'No description'}
                    </div>

                    <div className="px-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                            ${item.priority === 'high'
                            ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]'
                            : item.priority === 'med'
                            ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                            : 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                            }`}
                        >
                            {item.priority === 'med' ? 'Medium' : item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                        </div>

                    <div className="px-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                            ${item.status === 'completed'
                            ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                            : item.status === 'in progress'
                            ? 'bg-[var(--color-info-bg)] text-[var(--color-info)]'
                            : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                            }`}
                        >
                            {item.status === 'in progress'
                            ? 'In Progress'
                            : item.status === 'not started'
                            ? 'Not Started'
                            : 'Completed'}
                        </span>
                    </div>

                    <div className="px-3 text-sm text-[var(--color-muted)]">
                    {formatDueDate(item.dueDate)}
                    </div>

                    <div className="flex items-center justify-center gap-3 px-3">
                    <button type="button" className="p-2 rounded-lg text-[var(--color-info)] hover:bg-blue-50 transition-colors" title="View" onClick={()=>handleViewTask(item)}>
                        <Eye size={18} />
                    </button>

                    <button type="button" className="p-2 rounded-lg text-[var(--color-accent)] hover:bg-blue-50 transition-colors" title="Edit" onClick={()=>handleEditTask(item)}>
                        <PencilLine size={18} />
                    </button>

                    <button type="button" className="p-2 rounded-lg text-[var(--color-danger)] hover:bg-red-50 transition-colors" title="Delete" onClick={()=>handleDeleteClick(item)}>
                        <Trash size={18} />
                    </button>
                    </div>
                </div>
                )
            })}

            </div>
        </div>

        {showViewModal && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">

                {/* Modal Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-[var(--color-text)]">
                        Task Details
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowViewModal(false)}
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Task Details */}
                <div className="space-y-4">

                    <div>
                        <p className="text-sm text-[var(--color-muted)]">Title</p>
                        <p className="font-medium">{selectedTask.title}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[var(--color-muted)] mb-2">
                            Description
                        </p>

                        <div className="max-h-48 overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)] p-3">
                            <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap break-words">
                                {selectedTask.description || 'No description'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-[var(--color-muted)]">Priority</p>
                        <p className="font-medium capitalize">
                            {selectedTask.priority === 'med'
                                ? 'Medium'
                                : selectedTask.priority}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-[var(--color-muted)]">Status</p>
                        <p className="font-medium capitalize">
                            {selectedTask.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-[var(--color-muted)]">Due Date</p>
                        <p className="font-medium">
                            {formatDueDate(selectedTask.dueDate)}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={() => setShowViewModal(false)}
                        className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-sidebar-hover)]"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
        )}

        {showEditModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <div className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-6">

                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Edit Task
                        </h2>

                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="p-2 rounded-lg hover:bg-[var(--color-secondary)]"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleUpdateTask} className="space-y-4">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Task Title
                            </label>

                            <input
                                type="text"
                                value={editTask.title}
                                onChange={(e) => setEditTask({
                                    ...editTask,
                                    title: e.target.value
                                })}
                                required
                                className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>

                            <textarea
                                value={editTask.description}
                                onChange={(e) => setEditTask({
                                    ...editTask,
                                    description: e.target.value
                                })}
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
                                value={editTask.priority}
                                onChange={(e) => setEditTask({
                                    ...editTask,
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
                                value={editTask.status}
                                onChange={(e) => setEditTask({
                                    ...editTask,
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
                                Due Date
                            </label>

                            <input
                                type="date"
                                value={editTask.dueDate}
                                onChange={(e) => setEditTask({
                                    ...editTask,
                                    dueDate: e.target.value
                                })}
                                className="w-full border border-[var(--color-border)] rounded-lg p-2.5 outline-none focus:border-[var(--color-accent)]"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-[var(--color-danger)]">
                                {error}
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-3">

                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-sidebar-hover)] disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        )}

        {showDeleteModal && deleteTaskItem && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                 <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
                   {/* Modal Header */}
                   <div className="flex items-center justify-between mb-4">
                    <h2 className='text-xl font-semibold text-[var(--color-text)]'>Delte Task</h2>
                    
                    <button type='button' onClick={()=>setShowDeleteModal(false)}  disabled={deleting} className='p-2 rounded-lg hover:bg-[var(--color-secondary)]'>
                        <X size={20}/>
                    </button>
                   </div>
                   {/* Confirmation Message */}
                    <div className="mb-6">
                        <p className="text-sm text-[var(--color-muted)]">
                            Are you sure you want to delete this task?
                        </p>

                        <p className="font-semibold text-[var(--color-text)] mt-2">
                            "{deleteTaskItem.title}"
                        </p>

                        <p className="text-sm text-[var(--color-danger)] mt-3">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-[var(--color-danger)] mb-3">
                            {error}
                        </p>
                    )}

                    <button type='button' disabled={deleting}
                    onClick={()=>setShowDeleteModal(false)}
                        className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)] disabled:opacity-60">
                         Cancel
                    </button>
                    <button type="button" onClick={handleDeleteTask}
                        disabled={deleting} className="px-5 py-2 rounded-lg bg-[var(--color-danger)] text-white hover:bg-red-700 disabled:opacity-60">
                        {deleting ? 'Deleting...' : 'Delete Task'}
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default TaskTable
