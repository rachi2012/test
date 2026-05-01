const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
} = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { taskSchema, updateStatusSchema } = require('../validations/task.validation');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);

// Admin only routes
router.post('/', authorize('admin'), validate(taskSchema), createTask);
router.put('/:id', authorize('admin'), validate(taskSchema), updateTask);
router.delete('/:id', authorize('admin'), deleteTask);

module.exports = router;
