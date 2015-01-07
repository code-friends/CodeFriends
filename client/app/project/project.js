/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, Projects, documentFactory) {
    Auth.isLoggedIn();
    $scope.username = null;
    $scope.files = [];
<<<<<<< HEAD
    $scope.currentProjectId = null;

    $scope.getAllFiles = function () {
      console.log('$stateParams: ', $stateParams);
      return $http.get('/api/project/' + $stateParams.projectName)
        .then(function (res) {
          $scope.currentProjectId = res.data.id;
          $scope.currentProjectName = res.data.project_name; //change eventually to project id
          console.log('$scope.currentProjectId: ', $scope.currentProjectId);
          console.log('res: ', res);
          $scope.files = res.data.files;
          console.log('$scope.files!!', $scope.files);
          return $scope.files;
        })
        .catch(function (err) {
          console.log('COULD NOT GET SINGLE PROJECT', err);
        });
    };

    $scope.Projects = Projects;
    $scope.updateName = function (name) {
      $scope.Projects.updateName(name, function () {
        console.log('Projects.filename', Projects.filename);
      });
    };

    $scope.getAllFiles = function () {
      return $http.get('/api/project/' + $stateParams.projectName)
        .then(function (res) {
          $scope.currentProjectId = res.data.id;
          $scope.files = res.data.files;
          console.log('$scope.files!!', $scope.files);
          return $scope.files;
        });
    };
=======

    Auth.getUserName()
      .then(function (userName) {
        $scope.username = userName;
      });
>>>>>>> adds shadow and css to video

    $scope.goToHome = function () {
      $state.go('home');
    };

    $scope.addNewFile = function () {
      return Files.addNewFile($scope.newFileName, $stateParams.projectName)
        .then(function (files) {
          console.log('Files:', files);
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
          console.log('Files:', files);
          $scope.files = files;
        });

      return $http.post('/api/file', {
          file_name: $scope.newFileName,
          project_name: $stateParams.projectName,
          type: 'file',
          parent_file: null
        })
        .then(function () {
          console.log('Created New File');
          return $scope.getAllFiles();
        });
    };
    $scope.getAllFiles();
  });