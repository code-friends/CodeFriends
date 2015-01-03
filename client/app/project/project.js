/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files) {
    Auth.isLoggedIn();
    $scope.files = [];
    $scope.goToHome = function () {
      $state.go('home');
    };
    $scope.addNewFile = function () {
      Files.addNewFile($scope.newFileName, $stateParams.projectName)
        .then(function (files) {
          console.log('Files:', files);
          $scope.files = files;
        });
    };
    Files.getAllFiles($stateParams.projectName)
      .then(function (files) {
        console.log('Files:', files);
        $scope.files = files;
      });
  });