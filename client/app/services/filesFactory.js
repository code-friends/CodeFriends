/*global angular:true*/
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('FilesFactory', FilesFactory);

  FilesFactory.$inject = ['$http'];

  function FilesFactory($http) {

    var factory = {
      files: null,
      getAllFiles: getAllFiles,
      _addNew: _addNew,
      addNewFile: _addNew('file'),
      addNewFolder: _addNew('folder'),
      moveFile: moveFile
    };
    return factory;

    function getAllFiles(projectName) {
      return $http.get('/api/project/' + projectName)
        .then(function (res) {
          factory.files = res.data.files;
          return res.data.files;
        });
    }

    function _addNew(type) {
      return function (newFileName, projectName, path) {
        var filePath = newFileName;
        if (path) {
          filePath = path + '/' + newFileName;
        }
        return $http.post('/api/file', {
            filePath: filePath,
            projectName: projectName,
            type: type,
          })
          .then(function () {
            // Get files with added files
            return factory.getAllFiles(projectName);
          })
          .catch(function (err) {
            console.log('Error POSTing new file', err);
          });
      };
    }

    function moveFile(projectName, type, filePath, newPath, projectIdOrName) {
      console.log('- - - - -');
      console.log('filePath', filePath);
      console.log('newPath', newPath);
      console.log('projectIdOrName', projectIdOrName);
      console.log('projectName', projectName);
      console.log('type', type);
      if (filePath[0] !== '/') {
        filePath = '/' + filePath;
      }
      return $http.put('/api/file/move', {
        projectName: projectName,
        type: type,
        filePath: filePath,
        newPath: newPath,
        projectIdOrName: projectIdOrName
      }).then(function (res) {
        console.log('response from server', res);
        return res.data.files;
      });
    }

  }

})();