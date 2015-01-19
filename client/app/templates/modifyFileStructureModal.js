/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.fileStructure')
    .controller('modifyFileStructureModalController', ['movedFile', '$scope', '$stateParams', '$modalInstance', 'FilesFactory', 'ProjectFactory', 'SocketFactory', function (movedFile, $scope, $stateParams, $modalInstance, FilesFactory, ProjectFactory, SocketFactory) {
      $scope.movedFile = movedFile;
      $scope.folderPaths = ProjectFactory.folderPaths;
      $scope.folderSelected = 'Specify a destination';
      $scope.newPath = null;

      $scope.init = function () {
        ProjectFactory.getProject($stateParams.projectName)
          .then(function (project) {
            $scope.folderPaths = ProjectFactory.getFolderPaths(project.files);
          });
      };

      $scope.getDestinationPath = function ($event) {
        $scope.folderSelected = $event.target.innerText;
        //moving to root
        if ($scope.folderSelected === '/') {
          $scope.newPath = '/' + $scope.movedFile.fileName;
        }
        //moving elsewhere
        if ($scope.folderSelected !== '/') {
          $scope.newPath = $scope.folderSelected + '/' + $scope.movedFile.fileName;
        }
        return $scope.newPath;
      };

      $scope.moveFile = function () {
        $modalInstance.close();
        FilesFactory.moveFile($stateParams.projectName, $scope.movedFile.fileType, $scope.movedFile.filePath, $scope.newPath, $stateParams.projectName)
          .then(function (res) {
            SocketFactory.send({
              type: 'project structure changed'
            });
          });
      };


      $scope.init();

    }]);
})();