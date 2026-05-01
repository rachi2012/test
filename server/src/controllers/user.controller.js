const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all members
// @route   GET /api/users/members
// @access  Private/Admin
exports.getMembers = async (req, res, next) => {
  try {
    const members = await User.find({ role: 'member' });
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};
