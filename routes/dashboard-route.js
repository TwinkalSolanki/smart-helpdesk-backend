const dashboardController = require('../controllers/dashboardController');
const {protectAndAuthorize} = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
    app.get('/getDashboardStats', protectAndAuthorize(UserRole.User.key), dashboardController.getDashboardStats);
    app.get('/getRecentTickets', protectAndAuthorize(UserRole.User.key), dashboardController.getRecentTickets);
    app.get('/getTicketsByStatus', protectAndAuthorize(), dashboardController.getTicketsByStatus);
    app.get('/getTicketsByPriority', protectAndAuthorize(), dashboardController.getTicketsByPriority);
    app.get('/getTicketTrends', protectAndAuthorize(), dashboardController.getTicketTrends);
};
