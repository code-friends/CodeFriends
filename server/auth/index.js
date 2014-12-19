var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
// var User = require('../user/userModel').User;
// var collections = require('../collections');

passport.serializeUser(function (user, done) {
  console.log('serializeUser');
  return done(null, user.get('id'));
});

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser');
  // collections.Users
  //   .query('where', 'id', '=', id)
  //   .fetchOne()
  //   .then(function (model) {
  //     return done(null, model);
  //   });
});

passport.use(new GitHubStrategy({
    clientID: '59a42668d2f20b9d11ad',
    clientSecret: 'c64fb966dd0c8804fd8a8eedbf9638bcad8bbfe2',
    callbackURL: 'http://127.0.0.1:8000'
  },
  function (accessToken, refreshToken, profile, done) {
    console.log('passport GitHubStrategy');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // collections.Users
    //   .query('where', 'username', '=', profile.id)
    //   .fetchOne()
    //   .then(function (user) {
    //     if (user) {
    //       return done(null, user);
    //     }
    //     return done(null, null);
    //   })
    //   .catch(function (err) {
    //     return done(null, false);
    //   });
  }
));

passport.checkIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;