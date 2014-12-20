/*global angular:true */
// factory for Projects
angular.module('code.services', [])
  .factory('Projects', function ($http) {
    var projects = {};

    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    projects.getProjects = function (cb) {
      $http.get('api/project/')
        .then(function (res) {
          projects.userProjects = res.data;
          cb(res.data);
        });
    };

    return projects;
  })
  .factory('Auth', function ($http, $state) {
    var Auth = {
      isLoggedIn: function () {
        return $http.get('/auth/user')
          .then(function (res) {
            Auth.userId = res.data.userId;
            if (res.data.userId === null) {
              $state.go('login');
            }
          });
      },
      userId: null
    };
    return Auth;
  });