/*global angular:true */
'use strict';

angular.module('code.toolbar', [])
  .controller('toolbarController', function ($scope, $state, $stateParams, $http, ToolbarDocument, Projects, Files) {
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


    $scope.addFile = function () {
      console.log('Add file!');
      var projectName = $stateParams.projectName;
      var fileName = 'Example.html';
      Projects.addFile(projectName, fileName);
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
  });