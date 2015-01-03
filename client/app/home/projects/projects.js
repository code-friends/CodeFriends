/*global angular:true, moment:true */
'use strict';

angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects, chatFactory) {

    // on project state initialize, get projects
    $scope.init = function () {
      Projects.getProjects()
        .then(function (projects) {
          $scope.projects = projects;
        });
    };

    $scope.createProject = function () {
      return $http.post('/api/project', {
          project_name: $scope.newProjectName
        })
        .then(function (res) {
          return res.data;
        })
        .then(function () {
          return Projects.getProjects(function (res) {
            $scope.projects = res;
          });
        })
        .then(function () {
          $scope.init();
        });
    };
    $scope.init();
  });