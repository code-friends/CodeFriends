var authController = {};

authController.login = function (req, res) {
  res.json({
    userId: 1,
  });
};

authController.signup = function (req, res) {
  res.json({
    userId: 1,
  });
};

authController.logout = function (req, res) {
  console.log('LOGOUT');
  res.status(200).end();
};

module.exports = authController;