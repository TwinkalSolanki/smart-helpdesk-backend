const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { success, error } = require('../constant');

const generateToken = (user) => {
    return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        let existingUser = await User.findOne({ email});
        if(existingUser) {
            return res.status(400).json({ success: false, message: error.USER_EXISTS });
        }

        const user = await User.create({ name, email, phone, password, role});
        res.status(201).json({ success: true, message: success.USER_REGISTERED, data: user });

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: error.USER_NOT_FOUND });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: error.INVALID_CREDENTIALS });
    const userData = await User.findById(user._id).select('-password');
    const token = generateToken(user);
    res.json({ success: true, message: success.LOGIN_SUCCESS, token, role: user.role, userDetail: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
  }
};