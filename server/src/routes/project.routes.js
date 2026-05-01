const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectSchema } = require('../validations/project.validation');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProject);

// Admin only routes
router.post('/', authorize('admin'), validate(projectSchema), createProject);
router.put('/:id', authorize('admin'), validate(projectSchema), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);
router.post('/:id/members', authorize('admin'), addMember);
router.delete('/:id/members/:userId', authorize('admin'), removeMember);

module.exports = router;
