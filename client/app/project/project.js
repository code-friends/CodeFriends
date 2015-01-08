/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, ProjectFactory, documentFactory, SocketFactory) {
    // Auth.username should now be here, since we're making the http request
    // before getting here
    $scope.username = Auth.userName;
    $scope.files = [];
    $scope.currentProjectId = null;

    SocketFactory.onRefreshProject(function () {
      $scope.getProject();
    });

    // saves current project id, current project name and files to $scope
    $scope.getProject = function () {
      return ProjectFactory.getProject($stateParams.projectName)
        .then(function (project) {
          $scope.currentProjectId = project.id;
          $scope.currentProjectName = project.project_name; //change eventually to project id
          $scope.files = project.files;
          return $scope.files;
        })
        .catch(function (err) {
          console.log('Could Not Get Project', err);
        });
    };

    $scope.goToHome = function () {
      $state.go('home');
    };
    $scope.getProject();
  });