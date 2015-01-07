/*global angular:true, moment:true, _:true */
'use strict';

// factory for Projects, Auth, Toolbar
angular.module('code.services', [])
  .factory('Projects', function ($http) {
    // gets projects from server, caches projects in factory and allows cb in controller to access projects
    var projects = {};
    projects.userProjects = null;
    projects.filename = null;

    projects.updateName = function (name) {
      this.filename = name;
    };

    projects.getProjectId = function (projectName) {
      for (var i in projects) {
        if (projects.hasOwnProperty(i)) {
          if (projects[i].project_name === projectName) {
            console.log(projects[i]);
            return projects[i].id;
          }
        }
      }
      return null;
    };

    projects.getProject = function (projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          return res.data;
        });
    };

    projects.getProjects = function () {
      return $http.get('api/project/')
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
            theProject.timeAgoString = moment(theProject.updated_at).fromNow();
          });
          return projects;
        })
        .then(function (_projects) {
          projects.userProjects = _projects;
          return _projects;

        });
    };

    projects.addUser = function (userName, projectName) {
      return $http.put('api/project/addUser', {
          newUserName: userName,
          project_name: projectName
        })
        .catch(function (error) {
          console.log('error!!!!', error);
        });
    };

    return projects;
  })
  .factory('Auth', function ($http, $state, $q) {
    var Auth = {
      isLoggedIn: function (redirectToLogin) {
        return $http.get('/auth/user')
          .then(function (res) {
            Auth.userId = res.data.userId;
            Auth.userName = res.data.userName;
            Auth.githubAvatarUrl = res.data.githubAvatarUrl;
            if (res.data.userId === null && redirectToLogin !== false) {
              $state.go('login');
            }
            return {
              'userName': Auth.userName,
              'userId': Auth.userId,
              'githubAvatarUrl': Auth.githubAvatarUrl,
            };
          });
      },
      getUserName: function () {
        if (Auth.userName === undefined) {
          return Auth.isLoggedIn();
        } else {
          return $q.when({
            'userName': Auth.userName,
            'userId': Auth.userId,
            'githubAvatarUrl': Auth.githubAvatarUrl
          });
        }
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
          files.files = res.data.files;
          return res.data.files;
        });
    };

    files._addNew = function (type) {
      return function (newFileName, projectName, path) {
        return $http.post('/api/file', {
            file_name: newFileName,
            project_name: projectName,
            type: type,
            path: path || null
          })
          .then(function () {
            // Get files with added files
            console.log(projectName);
            return files.getAllFiles(projectName);
          });
      };
    };
    files.addNewFile = files._addNew('file');
    files.addNewFolder = files._addNew('folder');
    return files;
  });