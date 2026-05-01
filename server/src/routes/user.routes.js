const express = require('express');
const { getUsers, getMembers } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/members', getMembers);

module.exports = router;
