const notificationController = require('../controllers/notificationController');
const { protectAndAuthorize } = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
  app.get('/getNotifications', protectAndAuthorize(UserRole.User.key, UserRole.Agent.key, UserRole.Admin.key), notificationController.getNotifications);
  app.put('/markNotificationAsRead/:id', protectAndAuthorize(UserRole.User.key, UserRole.Agent.key, UserRole.Admin.key), notificationController.markAsRead);
  app.put('/markAllNotificationsAsRead', protectAndAuthorize(UserRole.User.key, UserRole.Agent.key, UserRole.Admin.key), notificationController.markAllAsRead);
  app.get('/getUnreadNotificationCount', protectAndAuthorize(UserRole.User.key, UserRole.Agent.key, UserRole.Admin.key), notificationController.getUnreadCount);
};
