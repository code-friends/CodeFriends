/*global angular:true, moment:true */

'use strict';

angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects, chatFactory, $modal) {
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
        size: 'lg'
      }).result.then(function () {
        $scope.init();
      });
    };

    $scope.init();
  })
  .controller('createProjectModalController', function ($scope, $modalInstance, Projects) {


    $scope.closeModal = function () {
      $modalInstance.close();
      Projects.createProject($scope.newProjectName);
    };
  });