// factory for Projects
angular.module('code.services', [])
  .factory('Projects', function ($http) {
    var projects = {};

    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    projects.getProjects = function(cb) {
      $http.get('api/project/')
        .then(function (res) {
          projects.userProjects = res.data;
          cb(res.data);
        });
    };

    return projects;
  });