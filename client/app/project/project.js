/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($rootScope, $scope, $state, $stateParams, $http, Auth, Files, ProjectFactory, documentFactory, SocketFactory) {
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
          if (typeof $state.params.documentName === 'undefined') {
            var firstFile;
            angular.forEach(project.files, function (file) {
              if (file.type === 'file') {
                firstFile = file;
                return;
              }
            });
            $state.go('document', {
              'projectName': $state.params.projectName,
              'projectId': $state.params.projectId,
              'documentPath': firstFile.path
            });
          }
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