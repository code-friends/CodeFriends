/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http) {
    console.log('Project Name: ', $stateParams.projectName);
    $scope.files = [];
    $scope.getAllFiles = function () {
      return $http.get('/api/project/' + $stateParams.projectName)
        .then(function (res) {
          $scope.files = res.data.files;
          return $scope.files;
        });
    };
    $scope.goToHome = function () {
      $state.go('home');
    };
    $scope.addNewFile = function () {
      return $http.post('/api/file', {
        file_name: $scope.newFileName,
        project_name: $stateParams.projectName, // Where can we get this from?
        parent_file: null
      })
      .then(function () {
        return $scope.getAllFiles();
      });
    };
    $scope.getAllFiles();
  });