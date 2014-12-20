var authController = {};

authController.getUser = function (req, res) {
  var userId = null;
  if (req.user && req.user.get('id') && typeof req.user.get('id') === 'number') {
    userId = req.user.get('id');
  }
  res.json({
    userId: userId,
  });
};

authController.logout = function (req, res) {
  res.logout();
  res.status(200).end();
};

module.exports = authController;