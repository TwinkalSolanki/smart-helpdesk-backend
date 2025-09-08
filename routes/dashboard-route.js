const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../middlewares/authMiddleware');

module.exports = (app) => {
    app.get('/getDashboardStats', authenticateUser, dashboardController.getDashboardStats);
    app.get('/getRecentTickets', authenticateUser, dashboardController.getRecentTickets);
    app.get('/getTicketChartData', authenticateUser, dashboardController.getTicketChartData);
};
