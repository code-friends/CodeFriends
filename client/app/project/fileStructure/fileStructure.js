/*global angular:true, CodeMirror:true */
/*jshint browser:true */

(function () {
  'use strict';
  angular.module('codeFriends.fileStructure', [])
    .controller('FileStructureController', FileStructureController);

  FileStructureController.$inject = ['$state', '$stateParams', 'AuthFactory', 'ProjectFactory', 'DocumentFactory', 'SocketFactory'];

  function FileStructureController($state, $stateParams, AuthFactory, ProjectFactory, DocumentFactory, SocketFactory) {
    var vm = this;
    vm.username = AuthFactory.userName;
    vm.files = [];
    vm.folderPaths = []; //you might not need this, take out later mabes
    vm.currentProjectId = null;
    vm.currentProjectName = null;
    vm.getProject = getProject;

    getProject();

    SocketFactory.onRefreshProject(function () {
      vm.getProject();
    });


    var addLevelToAllFiles = function (fileStructure, level) {
      for (var i in fileStructure) {
        if (fileStructure.hasOwnProperty(i)) {
          var file = fileStructure[i];
          file.level = level;
          if (file.type === 'folder') {
            addLevelToAllFiles(file.files, level + 1);
          }
        }
      }
    };

    // saves current project id, current project name, files and folderpaths to vm
    function getProject() {
      return ProjectFactory.getProject($stateParams.projectName)
        .then(function (project) {
          vm.currentProjectId = project.id;
          vm.currentProjectName = project.projectName;
          vm.files = project.files;
          // Add Level To Project
          addLevelToAllFiles(vm.files, 0);
          console.log(vm.files);
          // Determine First File In Project
          if (typeof $state.params.documentPath === 'undefined') {
            var firstFile;
            angular.forEach(project.files, function (file) {
              if (file.type === 'file') {
                firstFile = file;
                return;
              }
            });
            if (firstFile && firstFile.path) {
              $state.go('document', {
                'projectName': $state.params.projectName,
                'projectId': $state.params.projectId,
                'documentPath': firstFile.path
              });
            }
          }
          return vm.files;
        })
        .then(function () { //you might not need this, take out later mabes
          vm.folderPaths = ProjectFactory.getFolderPaths(vm.files);
          console.log('folderpathsss in this proyecto', vm.folderPaths);
        })
        .catch(function (err) {
          console.log('Could Not Get Project', err);
        });
    }

  }
})();