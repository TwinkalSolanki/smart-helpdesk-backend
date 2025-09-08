const userController = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
  app.get('/getAllUsers', authenticateUser, authorizeRoles(UserRole.Admin.key), userController.getAllUsers);
  app.get('/getUserById/:id', authenticateUser, authorizeRoles(UserRole.Admin.key), userController.getUserById);
  app.put('/updateUserRole/:id', authenticateUser, authorizeRoles(UserRole.Admin.key), userController.updateRole);
  app.delete('/deleteUser/:id', authenticateUser, authorizeRoles(UserRole.Admin.key), userController.deleteUser);
};

 