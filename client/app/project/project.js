/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, Projects, documentFactory) {
    Auth.isLoggedIn();
    $scope.username = null;
    $scope.files = [];
    $scope.currentProjectId = null;

    Auth.getUserName()
      .then(function (userName) {
        $scope.username = userName;
      });

    $scope.getAllFiles = function () {
      return Projects.getProject($stateParams.projectName)
        .then(function (project) {
          $scope.currentProjectId = project.id;
          $scope.currentProjectName = project.project_name; //change eventually to project id
          $scope.files = project.files;
          console.log($scope.files);
          return $scope.files;
        })
        .catch(function (err) {
          console.log('Could Not Get Project', err);
        });
    };

    $scope.Projects = Projects;
    $scope.updateName = function (name) {
      $scope.Projects.updateName(name, function () { });
    };

    $scope.getAllFiles = function () {
      return $http.get('/api/project/' + $stateParams.projectName)
        .then(function (res) {
          $scope.currentProjectId = res.data.id;
          $scope.files = res.data.files;
          return $scope.files;
        });
    };

    $scope.goToHome = function () {
      $state.go('home');
    };

    $scope.addNewFile = function () {
      return Files.addNewFile($scope.newFileName, $stateParams.projectName)
        .then(function (files) {
          $scope.files = files;
          var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
            mode: 'javascript',
            value: 'function(){}',
            lineNumbers: true,
            matchBrackets: true,
            theme: 'solarized dark'
          });
          documentFactory.goToDocument($scope.newFileName, $stateParams.projectName, cm);
        });

      Files.getAllFiles($stateParams.projectName)
        .then(function (files) {
          $scope.files = files;
        });

      return $http.post('/api/file', {
          file_name: $scope.newFileName,
          project_name: $stateParams.projectName,
          type: 'file',
          parent_file: null
        })
        .then(function () {
          return $scope.getAllFiles();
        });
    };
    $scope.getAllFiles();
  });