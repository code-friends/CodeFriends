/*global angular:true*/
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('ProjectFactory', ProjectFactory);

  ProjectFactory.$inject = ['$http'];

  function ProjectFactory($http) {

    var factory = {
      files: null,
      projectId: null,
      projectName: null,
      folderPaths: null,
      getProject: getProject,
      getFolderPaths: getFolderPaths,
    };

    return factory;

    // returns all project data & caches files, id and name
    // calls folderPaths
    function getProject(projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          factory.files = res.files;
          factory.projectId = res.id;
          factory.projectName = res.projectName;
          return res.data;
        });
    }

    function getFolderPaths(projectObj) {
      var paths = [];
      var recursive = function (project) {
        for (var file in project) {
          if (project[file].type === 'folder') {
            paths.push('/' + project[file].path);
          }
          if (typeof project[file].files === 'object' && !Array.isArray(project[file].files)) {
            if (Object.keys(project[file].files).length !== 0) {
              recursive(project[file].files);
            }
          }
        }
      };
      recursive(projectObj);
      factory.folderPaths = paths;
      return paths;
    }
  }

})();