var authController = {};

authController.login = function (req, res) {
  res.json({
    user_id: 1,
  });
};

authController.signup = function (req, res) {
  res.json({
    user_id: 1,
  });
};

authController.logout = function (req, res) {
  res.status(200).end();
};

module.exports = authController;