/*global angular:true */
'use strict';

angular.module('code.toolbar', ['ui.bootstrap'])
  .controller('toolbarController', function ($scope, $state, $stateParams, $http, Projects, ToolbarDocument, $modal, Files) {
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

    var formatThemeName = function (theme) {
      theme = theme.toLowerCase();
      if (theme.split(' ')[0] === 'solarized') return theme;
      return theme.replace(' ', '-');
    };

    $scope.changeEditorTheme = function (event) {
      ToolbarDocument.changeTheme(formatThemeName(event.target.innerText));
    };

    $scope.openAddFile = function () {
      $modal.open({
        templateUrl: '/app/templates/modalAddFile.html',
        controller: 'modalAddToProjectController',
        size: 'sm'
      });
    };

    $scope.openAddFolder = function () {
      $modal.open({
        templateUrl: '/app/templates/modalAddFolder.html',
        controller: 'modalAddToProjectController',
        size: 'sm'
      });
    };

    $scope.createNewFolder = function (event) {
      var folderName = prompt('Folder name:');
      Files.addNewFolder(folderName, $stateParams.projectName)
        .then(function () {
          console.log('New Folder Created');
        });
    };

    $scope.addUser = function () {
      return $http.put('api/project/addUser', {
          newUserName: $scope.newUser,
          project_name: $stateParams.projectName
        })
        .catch(function (error) {
          console.log('error!!!!', error);
        });
    };
  })
  .controller('modalAddToProjectController', function ($scope, Projects, $stateParams, $modalInstance) {
    $scope.addFile = function () {
      $modalInstance.close();
      console.log('Adding file in modalAddToProjectController');
      var projectName = $stateParams.projectName;
      console.log('projectName:', projectName);
      var fileName = $scope.newFileName;
      console.log('file name:', fileName);
      Projects.addFile(projectName, fileName);
    };

    $scope.addFolder = function () {
      $modalInstance.close();
      console.log('Adding folder in modalAddToProjectController');
      var projectName = $stateParams.projectName;
      console.log('projectName:', projectName);
      var folderName = $scope.newFolderName;
      console.log('folder name:', folderName);
      Projects.addFile(projectName, folderName);
    };
  });