const ticketController = require('../controllers/ticketController');
const { protectAndAuthorize } = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
  app.post('/createTicket', protectAndAuthorize(UserRole.User.key), ticketController.createTicket);
  app.get('/getAllTickets', protectAndAuthorize(UserRole.Admin.key, UserRole.Agent.key), ticketController.getAllTicket);
  app.get('/getMyTickets', protectAndAuthorize(UserRole.User.key), ticketController.getMyTickets);
  app.get('/getTicketById/:id', protectAndAuthorize(UserRole.Admin.key, UserRole.Agent.key, UserRole.User.key), ticketController.getTicketById);
  app.put('/assignTicket/:id', protectAndAuthorize(UserRole.Admin.key, UserRole.Agent.key), ticketController.assignTicket);
  app.put('/updateTicketStatus/:id', protectAndAuthorize(UserRole.Admin.key, UserRole.Agent.key), ticketController.updateStatus);
};

