/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.projects')
    .controller('createProjectModalController', ['$scope', '$modalInstance', '$upload', 'ProjectListFactory', function ($scope, $modalInstance, $upload, ProjectListFactory) {
      $scope.files = null;
      $scope.files = null;

      $scope.onFileSelect = function (files) {
        $scope.files = files;
      };

      $scope.closeModal = function () {
        console.log('closeModal');
        console.log($scope.files);
        if ($scope.newProjectName !== undefined) {
          ProjectListFactory.createProject($scope.newProjectName, $scope.files)
            .then(function () {
              $modalInstance.close();
            });
        }
      };

    }]);
})();