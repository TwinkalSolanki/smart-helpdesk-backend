const userController = require('../controllers/userController');
const { protectAndAuthorize } = require('../middlewares/authMiddleware');
const { UserRole } = require('../enum');

module.exports = (app) => {
  app.get('/getAllUsers', protectAndAuthorize(UserRole.Admin.key), userController.getAllUsers);
  app.get('/getUserById/:id', protectAndAuthorize(UserRole.Admin.key), userController.getUserById);
  app.put('/updateUserRole/:id', protectAndAuthorize(UserRole.Admin.key), userController.updateRole);
  app.delete('/deleteUser/:id', protectAndAuthorize(UserRole.Admin.key), userController.deleteUser);
};

 