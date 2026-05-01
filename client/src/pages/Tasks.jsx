import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Trash2,
  Edit2,
  Calendar
} from 'lucide-react';
import taskService from '../services/task.service';
import projectService from '../services/project.service';
import userService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { format, isPast, isToday } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ project: '', status: '', priority: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchData();
    } else {
      // Non-admin needs projects to see project names in modal (if they ever get to see one, though they shouldn't create)
      fetchProjects();
    }
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const { data } = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([
        projectService.getProjects(),
        userService.getMembers()
      ]);
      setProjects(projectsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Failed to fetch filter data');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getProjects();
      setProjects(data);
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask._id, formData);
        toast.success('Task updated');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await taskService.updateStatus(id, newStatus);
      toast.success('Status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project._id,
      assignedTo: task.assignedTo._id,
      priority: task.priority,
      status: task.status,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
    });
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-amber-100 text-amber-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-600';
      case 'in-progress': return 'bg-primary-100 text-primary-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-500">Track and manage project tasks.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { 
              setSelectedTask(null); 
              setFormData({
                title: '',
                description: '',
                project: projects[0]?._id || '',
                assignedTo: members[0]?._id || '',
                priority: 'medium',
                status: 'todo',
                dueDate: format(new Date(), 'yyyy-MM-dd')
              });
              setIsModalOpen(true); 
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Task
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm glass">
        <select 
          className="input"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <select 
          className="input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select 
          className="input"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </motion.div>
      ) : tasks.length > 0 ? (
        <motion.div variants={itemVariants} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Task Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Assigned To</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.map((task) => {
                  const isOverdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed';
                  return (
                    <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{task.title}</span>
                          <span className="text-xs text-gray-500">{task.project?.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-[10px] font-bold mr-2">
                            {task.assignedTo?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-700">{task.assignedTo?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                          getPriorityColor(task.priority)
                        )}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={clsx(
                            "text-sm font-medium",
                            isOverdue ? "text-red-600" : "text-gray-700"
                          )}>
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] font-bold uppercase text-red-500 flex items-center">
                              <AlertCircle size={10} className="mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={clsx(
                            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                            getStatusColor(task.status)
                          )}>
                            {task.status.replace('-', ' ')}
                          </span>
                          {(!isAdmin && task.assignedTo?._id === user?.id) && (
                            <select 
                              className="text-[10px] font-bold border-none bg-transparent focus:ring-0 text-primary-600 cursor-pointer"
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In-Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin && (
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => openEditModal(task)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(task._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-1">Refine your filters or create a new task.</p>
        </motion.div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 shrink-0">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedTask ? 'Edit Task' : 'New Task'}
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="label">Task Title</label>
                  <input
                    className="input"
                    placeholder="Enter task name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="What needs to be done?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Project</label>
                    <select
                      className="input"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Assign To</label>
                    <select
                      className="input"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      required
                    >
                      <option value="">Select Member</option>
                      {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      className="input"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Due Date</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 rounded-b-2xl shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;
