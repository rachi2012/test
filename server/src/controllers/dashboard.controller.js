const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    if (req.user.role !== 'admin') {
      projectFilter = { teamMembers: req.user.id };
      taskFilter = { assignedTo: req.user.id };
    }

    const totalProjects = await Project.countDocuments(projectFilter);
    const totalTasks = await Task.countDocuments(taskFilter);
    
    const pendingTasks = await Task.countDocuments({ ...taskFilter, status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'completed' });
    
    const now = new Date();
    const overdueTasksCount = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    });

    const recentTasks = await Task.find(taskFilter)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .sort('-createdAt')
      .limit(5);

    const overdueTasksList = await Task.find({
      ...taskFilter,
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    })
      .populate('project', 'title')
      .sort('dueDate')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasksCount,
        recentTasks,
        overdueTasksList
      },
    });
  } catch (err) {
    next(err);
  }
};
