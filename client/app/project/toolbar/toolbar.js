/*global angular:true */
'use strict';

angular.module('code.toolbar', ['ui.bootstrap'])
  .filter('getFoldersFromProject', function () {
    return function (project) {
      var folders = [];
      for (var file in project) {
        if (project[file].type === 'folder') {
          folders.push(project[file]);
        }
      }
      return folders;
    };
  })
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

    $scope.username = Auth.userName;
    $scope.currentProjectName = $stateParams.projectName;
    angular.extend($scope, $state.params);
    var formatThemeName = function (theme) {
      theme = theme.toLowerCase();
      if (theme.split(' ')[0] === 'solarized') return theme;
      return theme.replace(' ', '-');
    };

    $scope.downloadFile = function (event) {
      window.location = '/api/download/projectName/' +
        $state.params.projectName + '/fileName/' + $state.params.documentName;
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
  .controller('modalProjectController', function ($scope, $stateParams, $modalInstance, Files, Projects) {
    $scope.filesInProject = Files.files;

    $scope.status = {
      isopen: false
    };

    $scope.toggleDropdown = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.getFolderPath = function ($event) {
      $scope.folderSelected = $event.target.innerText;
      //only working for one level of folders now from root dir, not nested folders
      $scope.folderSelectedPath = '/' + $scope.folderSelected;
      return;
    };

    $scope.addFile = function () {
      $modalInstance.close();
      Files.addNewFile($scope.newFileName, $stateParams.projectName, $scope.folderSelectedPath)
        .then(function () {
          console.log('New File Created');
        });
    };

    $scope.addFolder = function () {
      $modalInstance.close();
      Files.addNewFolder($scope.newFolderName, $stateParams.projectName)
        .then(function () {
          console.log('New Folder Created');
        });
    };

    $scope.addUser = function () {
      $modalInstance.close();
      Projects.addUser($scope.addedUserName, $stateParams.projectName);
    };
  });