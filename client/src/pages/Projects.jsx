import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Trash2, Edit2, Users, Briefcase } from 'lucide-react';
import projectService from '../services/project.service';
import userService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'active', teamMembers: [] });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  const fetchMembers = async () => {
    try {
      const { data } = await userService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProject) {
        await projectService.updateProject(selectedProject._id, formData);
        toast.success('Project updated');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      setSelectedProject(null);
      setFormData({ title: '', description: '', status: 'active', teamMembers: [] });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? All associated tasks will be deleted.')) {
      try {
        await projectService.deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({ 
      title: project.title, 
      description: project.description,
      status: project.status || 'active',
      teamMembers: project.teamMembers?.map(m => typeof m === 'object' ? m._id : m) || []
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-500">Manage your team's projects and members.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { 
              setSelectedProject(null); 
              setFormData({ title: '', description: '', status: 'active', teamMembers: [] }); 
              setIsModalOpen(true); 
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={clsx(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
                    project.status === 'active' ? "bg-primary-100 text-primary-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {project.status}
                  </span>
                  {isAdmin && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(project)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>
                
                <div className="flex items-center text-xs text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {project.teamMembers?.length || 0} Members
                  </div>
                  <div className="flex items-center">
                    <CheckSquare size={14} className="mr-1" />
                    {project.taskCount || 0} Tasks
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.teamMembers?.slice(0, 3).map((m, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-[10px] font-bold text-primary-600 ring-2 ring-white">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.teamMembers?.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
          <p className="text-gray-500 mt-1">
            {isAdmin ? 'Get started by creating your first project.' : 'Please contact your admin to assign you a project.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedProject ? 'Edit Project' : 'New Project'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    className="input"
                    placeholder="Enter project name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input h-32 resize-none"
                    placeholder="What is this project about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                
                {/* Admin Powers: Status and Team Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Project Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Team Members</label>
                    <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto p-2 bg-gray-50/50 space-y-1">
                      {members.map(member => (
                        <label key={member._id} className="flex items-center p-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            checked={formData.teamMembers.includes(member._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, teamMembers: [...formData.teamMembers, member._id] });
                              } else {
                                setFormData({ ...formData, teamMembers: formData.teamMembers.filter(id => id !== member._id) });
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700">{member.name}</span>
                        </label>
                      ))}
                      {members.length === 0 && <span className="text-xs text-gray-400 p-1">No members available</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon dependency fix
const CheckSquare = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

export default Projects;
