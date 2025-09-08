const notificationController = require('../controllers/notificationController');
const { authenticateUser } = require('../middlewares/authMiddleware');

module.exports = (app) => {
  app.get('/getNotifications', authenticateUser, notificationController.getNotifications);
  app.put('/markAsRead/:id', authenticateUser, notificationController.markAsRead);
  // app.get('/getUnreadCount', protectAndAuthorize(UserRole.User.key, UserRole.Agent.key, UserRole.Admin.key), notificationController.getUnreadCount);
};
