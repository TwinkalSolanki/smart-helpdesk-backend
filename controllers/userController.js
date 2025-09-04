const User = require('../models/User');
const { error, success } = require('../constant');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users, total: users.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: error.USER_NOT_FOUND });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: error.USER_NOT_FOUND });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: error.USER_NOT_FOUND });
    res.json({ success: true, message: success.USER_DELETED });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
  }
}
