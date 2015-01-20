/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.toolbar', ['ui.bootstrap'])
    .controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = ['$rootScope', 'SocketFactory', '$state', '$stateParams', '$http', 'ToolbarFactory', '$modal', 'AuthFactory'];

  function ToolbarController($rootScope, SocketFactory, $state, $stateParams, $http, ToolbarFactory, $modal, AuthFactory) {
    var vm = this;
    vm.currentProjectName = $stateParams.projectName;
    vm.username = AuthFactory.userName;
    vm.githubAvatarUrl = AuthFactory.githubAvatarUrl;
    vm.downloadFile = downloadFile;
    vm.downloadProjectZip = downloadProjectZip;
    vm.changeEditorTheme = changeEditorTheme;
    vm.openAddFileModal = openAddFileModal;
    vm.openAddFolderModal = openAddFolderModal;
    vm.openAddUserModal = openAddUserModal;
    vm.emitCompile = emitCompile;
    vm.themes = [
      'Default',
      'Ambiance',
      // 'Base16 Dark',
      // 'Base16 Light',
      'Blackboard',
      'Cobalt',
      'Eclipse',
      'Elegant',
      // 'Lesser Dark',
      // 'Midnight',
      'Monokai',
      'Neat',
      // 'Neo',
      'Night',
      // 'Paraiso Dark',
      // 'Paraiso Light',
      // 'Ruby Blue',
      'Solarized Dark',
      'Solarized Light',
      'Twilight',
      'Vibrant Ink',
      'Xq Dark',
      'Xq Light',
      '3024 Day',
      '3024 Night'
    ];


    function emitCompile() {
      $rootScope.$broadcast('compile code');
    }

    function downloadFile() {
      var url = '/api/file/download/projectName/' + $state.params.projectName + '/fileName';
      if ($state.params.documentPath[0] === '/') {
        url += $state.params.documentPath;
      } else {
        url += '/' + $state.params.documentPath;
      }
      window.location = url;
    }

    function formatThemeName(theme) {
      theme = theme.toLowerCase();
      if (theme.split(' ')[0] === 'solarized') return theme;
      return theme.replace(' ', '-');
    }

    function downloadProjectZip() {
      window.location = '/api/project/download/' + $state.params.projectName;
    }

    function changeEditorTheme(event) {
      ToolbarFactory.changeTheme(formatThemeName(event.target.innerText));
    }

    function openAddFileModal() {
      $modal.open({
        templateUrl: '/app/templates/modalAddFile.html',
        controller: 'modifyProjectModalController',
        size: 'sm'
      });
    }

    function openAddFolderModal() {
      $modal.open({
        templateUrl: '/app/templates/modalAddFolder.html',
        controller: 'modifyProjectModalController',
        size: 'sm'
      });
    }

    function openAddUserModal() {
      $modal.open({
        templateUrl: '/app/templates/modalAddUser.html',
        controller: 'modifyProjectModalController',
        size: 'sm'
      });
    }

  }
})();