    const departmentController = require('../controllers/departmentController');
    const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
    const { UserRole } = require('../enum');

    module.exports = (app) => {
        app.post('/manageDepartment', authenticateUser, authorizeRoles(UserRole.Admin.key), departmentController.manageDepartment);
    }