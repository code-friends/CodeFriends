/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, documentFactory) {
    Auth.isLoggedIn();
    $scope.files = [];
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
    };
    Files.getAllFiles($stateParams.projectName)
      .then(function (files) {
        console.log('Files:', files);
        $scope.files = files;
      });
  });