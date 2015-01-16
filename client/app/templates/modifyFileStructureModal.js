/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.fileStructure')
    .controller('modifyFileStructureModalController', ['movedFile', '$scope', '$stateParams', '$modalInstance', 'FilesFactory', 'ProjectFactory', 'SocketFactory', function (movedFile, $scope, $stateParams, $modalInstance, FilesFactory, ProjectFactory, SocketFactory) {
      $scope.movedFile = movedFile;
      $scope.folderPaths = ProjectFactory.folderPaths;
      $scope.folderSelected = 'Specify a folder';
      $scope.newPath = null;

      $scope.init = function () {
        console.log('projectname!', $stateParams.projectName);
        ProjectFactory.getProject($stateParams.projectName)
          .then(function (project) {
            // $scope.filesInProject = project.files;
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
        console.log($stateParams.projectName, $scope.movedFile.fileType, $scope.movedFile.filePath, $scope.newPath, $stateParams.projectName);
        FilesFactory.moveFile($stateParams.projectName, $scope.movedFile.fileType, $scope.movedFile.filePath, $scope.newPath, $stateParams.projectName)
          .then(function (res) {
            console.log('Successfully moved file');
            console.log('res', res);
            // SocketFactory.send({
            //   type: 'project structure changed'
            // });
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

      $scope.init();

    }]);
})();