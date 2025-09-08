const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = user; // attach user info for next middleware/controller
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // if no roles specified → allow all authenticated users
    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };

// exports.protectAndAuthorize = (...allowedRoles) => {
//   return async (req, res, next) => {
//     try {
//       // 1. Authentication: Check for valid token and user
//       const header = req.headers.authorization;
//       if (!header) return res.status(401).json({ success: false, message: 'No token provided' });
      
//       const token = header.startsWith('Bearer ') ? header.slice(7) : header;
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
      
//       req.user = await User.findById(payload.id).select('-password');
//       if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

//       // 2. Authorization: Check if user's role is allowed
//       if (!allowedRoles.includes(req.user.role)) {
//         return res.status(403).json({ success: false, message: 'Forbidden' });
//       }

//       next();
//     } catch (err) {
//       return res.status(401).json({ success: false, message: 'Token invalid' });
//     }
//   };
// };