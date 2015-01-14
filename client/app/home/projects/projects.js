/*global angular:true, moment:true */

'use strict';

angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects, $modal) {
    // on project state initialize, get projects
    $scope.init = function () {
      return Projects.getProjects()
        .then(function (projects) {
          $scope.projects = projects;
          return $scope.projects;
        });
    };

    $scope.createProject = function (projectName) {
      return Projects.createProject(projectName);
    };

    $scope.openCreateProjectModal = function () {
      $modal.open({
        templateUrl: '/app/templates/modalCreateProject.html',
        controller: 'createProjectModalController',
        size: 'sm'
      }).result.then(function () {
        $scope.init();
      });
    };

    $scope.init();
  })
  .controller('createProjectModalController', function ($scope, $modalInstance, $upload, Projects) {
    $scope.files = null;
    $scope.onFileSelect = function (files) {
      $scope.files = files;
    };

    $scope.closeModal = function () {
      console.log('closeModal');
      console.log($scope.files);
      if ($scope.newProjectName !== undefined) {
        Projects.createProject($scope.newProjectName, $scope.files)
          .then(function () {
            $modalInstance.close();
          });
      }
    };
  });