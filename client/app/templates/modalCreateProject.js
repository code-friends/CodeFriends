/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.projects')
    .controller('createProjectModalController', ['$scope', '$modalInstance', '$upload', 'ProjectsFactory', function ($scope, $modalInstance, $upload, ProjectsFactory) {
      $scope.files = null;
      $scope.files = null;

      $scope.onFileSelect = function (files) {
        $scope.files = files;
      };

      $scope.closeModal = function () {
        console.log('closeModal');
        console.log($scope.files);
        if ($scope.newProjectName !== undefined) {
          ProjectsFactory.createProject($scope.newProjectName, $scope.files)
            .then(function () {
              $modalInstance.close();
            });
        }
      };

    }]);
})();