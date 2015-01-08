/*global angular:true */
'use strict';

angular.module('code.toolbar', ['ui.bootstrap'])
  // .filter('getFoldersFromProject', function () {
  //   return function (project) {
  //     var folders = [];
  //     for (var file in project) {
  //       if (project[file].type === 'folder') {
  //         folders.push(project[file]);
  //       }
  //     }
  //     return folders;
  //   };
  // })
  .controller('toolbarController', function ($scope, $state, $stateParams, $http, ToolbarDocument, $modal, Auth) {
    $scope.themes = [
      'Default',
      'Ambiance',
      'Base16 Dark',
      'Base16 Light',
      'Blackboard',
      'Cobalt',
      'Eclipse',
      'Elegant',
      'Lesser Dark',
      'Midnight',
      'Monokai',
      'Neat',
      'Neo',
      'Night',
      'Paraiso Dark',
      'Paraiso Light',
      'Ruby Blue',
      'Solarized Dark',
      'Solarized Light',
      'Twilight',
      'Vibrant Ink',
      'Xq Dark',
      'Xq Light',
      '3024 Day',
      '3024 Night'
    ];

    angular.extend($scope, $state.params);
    $scope.currentProjectName = $stateParams.projectName;
    $scope.username = Auth.userName;
    $scope.githubAvatarUrl = Auth.githubAvatarUrl;

    var formatThemeName = function (theme) {
      theme = theme.toLowerCase();
      if (theme.split(' ')[0] === 'solarized') return theme;
      return theme.replace(' ', '-');
    };

    $scope.downloadFile = function () {
      var url = '/api/file/download/projectName/' + $state.params.projectName + '/fileName';
      if ($state.params.documentPath[0] === '/') {
        url += $state.params.documentPath;
      }
      else {
        url += '/' + $state.params.documentPath;
      }
      window.location = url;
    };

    $scope.downloadProjectZip = function () {
      window.location = '/api/project/download/' + $state.params.projectName;
    };

    $scope.changeEditorTheme = function (event) {
      ToolbarDocument.changeTheme(formatThemeName(event.target.innerText));
    };

    $scope.openAddFileModal = function () {
      $modal.open({
        templateUrl: '/app/templates/modalAddFile.html',
        controller: 'modalProjectController',
        size: 'sm'
      });
    };

    $scope.openAddFolderModal = function () {
      $modal.open({
        templateUrl: '/app/templates/modalAddFolder.html',
        controller: 'modalProjectController',
        size: 'sm'
      });
    };

    $scope.openAddUserModal = function () {
      $modal.open({
        templateUrl: '/app/templates/modalAddUser.html',
        controller: 'modalProjectController',
        size: 'sm'
      });
    };
  })
  .controller('modalProjectController', function ($scope, $stateParams, $modalInstance, Files, Projects, ProjectFactory) {
    $scope.filesInProject = ProjectFactory.files;
    $scope.folderPaths = ProjectFactory.folderPaths;
    // currently hacky way of changing drop down button, set in getFolderPath()
    $scope.folderSelected = 'Specify a folder';

    $scope.status = {
      isopen: false
    };

    $scope.init = function () {
      ProjectFactory.getProject($stateParams.projectName)
        .then(function (project) {
          $scope.filesInProject = project.files;
          $scope.folderPaths = ProjectFactory.getFolderPaths(project.files);
        });
    };

    $scope.toggleDropdown = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.getFolderPath = function ($event) {
      $scope.folderSelected = $event.target.innerText;

      //if root set to undefined, Factory expects nothing for root dir
      if ($scope.folderSelected === 'root') {
        $scope.folderSelected = undefined;
      }
      return $scope.folderSelected;
    };

    $scope.addFile = function () {
      $modalInstance.close();
      Files.addNewFile($scope.newFileName, $stateParams.projectName, $scope.folderSelected)
        .then(function () {
          console.log('New File Created');
          ws.send({
            type: 'project structure changed',
            newFileName: $scope.newFileName,
            projectName: $stateParams.projectName,
            folderSelectedPath: $scope.folderSelectedPath
          });
        });
    };

    $scope.addFolder = function () {
      $modalInstance.close();
      Files.addNewFolder($scope.newFolderName, $stateParams.projectName, $scope.folderSelected)
        .then(function () {
          console.log('New Folder Created');
          ws.send({
            type: 'project structure changed',
            newFileName: $scope.newFileName,
            projectName: $stateParams.projectName,
            folderSelectedPath: $scope.folderSelectedPath
          });
        });
    };

    $scope.addUser = function () {
      $modalInstance.close();
      Projects.addUser($scope.addedUserName, $stateParams.projectName);
    };

    $scope.init();
  });