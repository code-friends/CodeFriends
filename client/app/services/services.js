/*global angular:true */
'use strict';

// factory for Projects, Auth, Toolbar
angular.module('code.services', [])
  .factory('Projects', function ($http) {

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
  })
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
      logOut: function () {

      },
      userId: null
    };
    return Auth;
  })
  .factory('ToolbarDocument', function ($rootScope) {
    var ToolbarDocument = {
      changeTheme: function (theme) {
        console.log('Theme:', theme);
        ToolbarDocument.theme = theme;
        $rootScope.$broadcast('theme:changed', theme);
        $rootScope.$emit('theme:changed', theme);
      },
      theme: 'default'
    };
    return ToolbarDocument;
  });