/*global angular:true, moment:true */
'use strict';

// factory for Projects, Auth, Toolbar
angular.module('code.services', [])
  .factory('Projects', function ($http) {

    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    var projects = {};

    projects.userProjects = null;

    projects.getProjects = function (cb) {
      $http.get('api/project/')
        .then(function (res) {
          var projects = res.data;
          // Add all avatars
          projects.forEach(function (project) {
            project.avatars = [];
            project.user.forEach(function (user) {
              project.avatars.push(user.githubAvatarUrl);
            });
          });
          // Add Create String
          angular.forEach(projects, function (theProject) {
            theProject.createString = moment(theProject.created_at).format('MMM Do YY');
            theProject.updateString = moment(theProject.updated_at).format('MMM Do YY');
          });
          return projects;
        })
        .then(function (projects) {
          this.userProjects = projects;
          cb(projects);
          return projects;
        });
    };
    return projects;
  })
  .factory('Auth', function ($http, $state) {
    var Auth = {
      isLoggedIn: function (redirectToLogin) {
        return $http.get('/auth/user')
          .then(function (res) {
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
        ToolbarDocument.theme = theme;
        $rootScope.$broadcast('theme:changed', theme);
        $rootScope.$emit('theme:changed', theme);
      },
      theme: 'default'
    };
    return ToolbarDocument;
  })
  .factory('Files', function ($http) {
    var files = {};

    files.getAllFiles = function (projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          return res.data.files;
        });
    };

    files._addNew = function (type) {
      return function (newFileName, projectName, path) {
        return $http.post('/api/file', {
            file_name: newFileName,
            project_name: projectName,
            type: type,
            parent_file: path || null
          })
          .then(function () {
            // Get files with added files
            return files.getAllFiles();
          });
      };
    };
    files.addNewFile = files._addNew('file');
    files.addNewFolder = files._addNew('folder');
    return files;
  });