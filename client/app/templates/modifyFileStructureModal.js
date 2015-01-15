/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.fileStructure')
    .controller('modifyFileStructureModalController', ['movedFile', '$scope', '$stateParams', '$modalInstance', 'FilesFactory', 'ProjectFactory', 'SocketFactory', function (movedFile, $scope, $stateParams, $modalInstance, FilesFactory, ProjectFactory, SocketFactory) {
      // $scope.filesInProject = ProjectFactory.files;
      $scope.movedFile = movedFile;
      $scope.folderPaths = ProjectFactory.folderPaths;
      $scope.folderSelected = 'Specify a folder';
      $scope.destinationPath = null;

      console.log('movedFileObj', movedFile);
      console.log('folderPaths', $scope.folderPaths);

      // $scope.init = function () {
      //   ProjectFactory.getProject($stateParams.projectName)
      //     .then(function (project) {
      //       $scope.filesInProject = project.files;
      //       $scope.folderPaths = ProjectFactory.getFolderPaths(project.files);
      //     });
      // };

      $scope.getDestinationPath = function ($event) {
        $scope.folderSelected = $event.target.innerText;
        $scope.destinationPath = $scope.folderSelected + $scope.movedFile.fileName;
        console.log('folder Selected for destination', $scope.folderSelected);
        console.log('destination path', $scope.destinationPath);
        return $scope.folderSelected;
      };

      $scope.moveFile = function () {
        $modalInstance.close();
        FilesFactory.addNewFile($scope.newFileName, $stateParams.projectName, $scope.folderSelected)
          .then(function () {
            console.log('New File Created');
            SocketFactory.send({
              type: 'project structure changed'
            });
          });
      };

      // $scope.addFolder = function () {
      //   $modalInstance.close();
      //   if ($scope.folderSelected === '/' || $scope.folderSelected === 'Specify a folder') {
      //     $scope.folderSelected = undefined;
      //   }
      //   FilesFactory.addNewFolder($scope.newFolderName, $stateParams.projectName, $scope.folderSelected)
      //     .then(function () {
      //       console.log('New Folder Created');
      //       SocketFactory.send({
      //         type: 'project structure changed'
      //       });
      //     });
      // };

      // $scope.addUser = function () {
      //   $modalInstance.close();
      //   ProjectListFactory.addUser($scope.addedUserName, $stateParams.projectName);
      // };

      // $scope.init();

    }]);
})();