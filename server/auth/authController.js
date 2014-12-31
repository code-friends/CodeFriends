var authController = {};

authController.getUser = function (req, res) {
  var userId = null,
    userName = null;
  if (req.user && req.user.get('id') && typeof req.user.get('id') === 'number') {
    userId = req.user.get('id');
    userName = req.user.get('username');
  }
  res.json({
    userId: userId,
    userName: userName
  });
};

authController.logout = function (req, res) {
  res.logout();
  res.status(200).end();
};

module.exports = authController;