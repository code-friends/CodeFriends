/*global angular:true, moment:true */
'use strict';

angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects, chatFactory) {

    // on project state initialize, get projects
    $scope.init = function () {
<<<<<<< HEAD
      Projects.getProjects()
        .then(function (projects) {
          $scope.projects = projects;
        });
=======
      Projects.getProjects(function (res) {
        $scope.projects = res;
      });
>>>>>>> Fixes project load bug on home view, takes out console.logs, add post requests for add file and folder in projects factory
    };

    $scope.createProject = function () {
      return $http.post('/api/project', {
          project_name: $scope.newProjectName
        })
        .then(function (res) {
          return res.data;
        })
        .then(function () {
          return Projects.getProjects()
            .then(function (projects) {
              $scope.projects = projects;
            });
        })
        .then(function () {
          $scope.init();
        });
<<<<<<< HEAD
=======
      $scope.init();
>>>>>>> Fixes project load bug on home view, takes out console.logs, add post requests for add file and folder in projects factory
    };
    $scope.init();
  });