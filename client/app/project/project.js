/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, ProjectFactory, documentFactory) {
    Auth.isLoggedIn();
    $scope.username = null;

    var ws = ngSocket('ws://' + window.location.hostname + ':' + window.config.ports.chat);

    ws.onMessage(function (msg) {
      var parsedMsg = JSON.parse(msg.data);
      if (parsedMsg.type === 'refresh project') {
        $scope.getAllFiles();
      }
    });

    Auth.getUserName()
      .then(function (userName) {
        $scope.username = userName;
      });

    // saves current project id, current project name and files to $scope
    $scope.getProject = function () {
      return ProjectFactory.getProject($stateParams.projectName)
        .then(function (project) {
          $scope.currentProjectId = project.id;
          $scope.currentProjectName = project.project_name; //change eventually to project id
          $scope.files = project.files;
          console.log('files in project on projectController loading', $scope.files);
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