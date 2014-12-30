/*global angular:true */
'use strict';

// factory for Projects, Auth
angular.module('code.services', [])
  .factory('ProjectsFactory', function ($http) {

    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    var projects = {};

    projects.userProjects = null;

    projects.getProjects = function (cb) {
      console.log('ENTERED GET PROJECTS !!!!!!!!');
      $http.get('api/project/')
        .then(function (res) {
          console.log(res.data);
          this.userProjects = res.data;
          cb(res.data);
        });
    };
    return projects;
  });

//factory for Authentication
.factory('Auth', function ($http, $state) {
  var Auth = {

    isLoggedIn: function (redirectToLogin) {
      return $http.get('/auth/user')
        .then(function (res) {
          console.log(res);
          Auth.userId = res.data.userId;
          Auth.userName = res.data.userName;
          if (res.data.userId === null && redirectToLogin !== false) {
            $state.go('login');
          }
        });
    },

    userId: null

  };

  return Auth;

});