const ticketController = require('../controllers/ticketController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
  app.post('/createTicket', authenticateUser, authorizeRoles(UserRole.User.key,UserRole.Admin.key), ticketController.createTicket);
  app.get('/getAllTickets', authenticateUser, authorizeRoles(UserRole.Admin.key, UserRole.Agent.key), ticketController.getAllTicket);
  app.get('/getMyTickets', authenticateUser, authorizeRoles(UserRole.User.key), ticketController.getMyTickets);
  app.get('/getTicketById/:id', authenticateUser, authorizeRoles(UserRole.Admin.key, UserRole.Agent.key, UserRole.User.key), ticketController.getTicketById);
  app.put('/assignTicket/:id', authenticateUser, authorizeRoles(UserRole.Admin.key, UserRole.Agent.key), ticketController.assignTicket);
  app.put('/updateTicketStatus/:id', authenticateUser, authorizeRoles(UserRole.Admin.key, UserRole.Agent.key), ticketController.updateStatus);
};

