/*global angular:true, CodeMirror:true */
/*jshint browser:true */

(function () {
  'use strict';
  angular.module('codeFriends.project', [])
    .controller('ProjectController', ProjectController);

  ProjectController.$inject = ['$state', '$stateParams', 'AuthFactory', 'ProjectFactory', 'documentFactory', 'SocketFactory'];

  function ProjectController($state, $stateParams, AuthFactory, ProjectFactory, documentFactory, SocketFactory) {
    var vm = this;
    vm.username = AuthFactory.userName;
    vm.files = [];
    vm.currentProjectId = null;
    vm.currentProjectName = null;
    vm.getProject = getProject;
    vm.escapeBackSlash = escapeBackSlash;

    getProject();

    SocketFactory.onRefreshProject(function () {
      vm.getProject();
    });

    // saves current project id, current project name and files to $scope
    function getProject() {
      return ProjectFactory.getProject($stateParams.projectName)
        .then(function (project) {
          vm.currentProjectId = project.id;
          vm.currentProjectName = project.projectName;
          vm.files = project.files;
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
        .catch(function (err) {
          console.log('Could Not Get Project', err);
        });
    }

    function escapeBackSlash(str) {
      str = str.replace(/(\/)/g, '%2F');
      return str;
    }
  }
})();