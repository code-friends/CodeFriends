/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.uploads', [])
    .controller('UploadsController', ['$scope', '$state', '$stateParams', '$http', '$upload', function ($scope, $state, $stateParams, $http, $upload) {

      $scope.onFileSelect = function (files) {
        var uploadFile = function (fileIndex) {
          return $upload.upload({
              method: 'POST',
              url: '/api/file/upload',
              data: {
                filePath: files[fileIndex].name,
                projectName: $stateParams.projectName,
              },
              file: files[fileIndex]
            })
            .then(function (newFileStructure) {
              if (files.length > fileIndex + 1) {
                return uploadFile(fileIndex + 1);
              } else {
                return true;
              }
            })
            .catch(function (error) {
              console.log('Error Uploading File: ', error);
            });
        };
        uploadFile(0)
          .then(function () {
            // TODO: Add Socket .send
          });
      };
      //get request to reload with updated files
    }]);
})();