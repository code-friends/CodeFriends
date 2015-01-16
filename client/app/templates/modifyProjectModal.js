/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.toolbar')
    .controller('modifyProjectModalController', ['$scope', '$stateParams', '$modalInstance', 'FilesFactory', 'ProjectListFactory', 'ProjectFactory', 'SocketFactory', function ($scope, $stateParams, $modalInstance, FilesFactory, ProjectListFactory, ProjectFactory, SocketFactory) {
      $scope.filesInProject = ProjectFactory.files;
      $scope.folderPaths = ProjectFactory.folderPaths;
      $scope.folderSelected = 'Specify a folder';

      $scope.init = function () {
        ProjectFactory.getProject($stateParams.projectName)
          .then(function (project) {
            $scope.filesInProject = project.files;
            $scope.folderPaths = ProjectFactory.getFolderPaths(project.files);
          });
      };

      $scope.getFolderPath = function ($event) {
        $scope.folderSelected = $event.target.innerText;
        return $scope.folderSelected;
      };

      $scope.addFile = function () {
        $modalInstance.close();
        if ($scope.folderSelected === '/' || $scope.folderSelected === 'Specify a folder') {
          $scope.folderSelected = undefined;
        }
        FilesFactory.addNewFile($scope.newFileName, $stateParams.projectName, $scope.folderSelected)
          .then(function () {
            console.log('New File Created');
            SocketFactory.send({
              type: 'project structure changed'
            });
          });
      };

      $scope.addFolder = function () {
        $modalInstance.close();
        if ($scope.folderSelected === '/' || $scope.folderSelected === 'Specify a folder') {
          $scope.folderSelected = undefined;
        }
        FilesFactory.addNewFolder($scope.newFolderName, $stateParams.projectName, $scope.folderSelected)
          .then(function () {
            console.log('New Folder Created');
            SocketFactory.send({
              type: 'project structure changed'
            });
          });
      };

      $scope.addUser = function () {
        $modalInstance.close();
        ProjectListFactory.addUser($scope.addedUserName, $stateParams.projectName);
      };

      $scope.init();

    }]);
})();