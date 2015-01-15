/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.projects')
    .controller('createProjectModalController', ['$scope', '$modalInstance', '$upload', 'ProjectListFactory', function ($scope, $modalInstance, $upload, ProjectListFactory) {
      $scope.files = null;
      $scope.gitRepoUrl = null;
      $scope.selectedTab = null;

      $scope.onFileSelect = function (files) {
        $scope.files = files;
      };

      $scope.changeCurrentTab = function (tabName) {
        $scope.selectedTab = tabName;
      }

      $scope.updateGitRepo = function (gitRepoUrl) {
        $scope.gitRepoUrl = gitRepoUrl;
      }

      $scope.closeModal = function () {
        if ($scope.newProjectName !== undefined) {
          var projectInfoObj = {};
          // Zip
          if ($scope.selectedTab === 'zipFile' &&
            Array.isArray($scope.files) &&
            $scope.files.length > 0
          ) {
            projectInfoObj = {
              type: 'zipFile',
              file: $scope.files // Array
            };
          }
          // Git Repo
          if ($scope.selectedTab === 'gitRepoUrl' &&
            typeof $scope.gitRepoUrl === 'string'
          ) {
            projectInfoObj = {
              type: 'gitRepoUrl',
              gitRepoUrl: $scope.gitRepoUrl
            };
          }
          // NOTE: It would be great if we could give the user some feedback that
          // this might take a while. Git cloning can take a couple of seconds.
          return ProjectListFactory.createProject($scope.newProjectName, projectInfoObj)
            .then(function () {
              $modalInstance.close();
            });
        }
      };
    }]);
})();