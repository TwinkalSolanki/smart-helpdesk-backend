const { register, login } = require('../controllers/authController');

module.exports = (app) => {
  app.post('/registerUser', register);
  app.post('/loginUser', login);
};
