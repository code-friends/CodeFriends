/*global angular:true */
'use strict';

angular.module('code.uploads', ['ui.router'])
  .controller('uploadsController', function ($scope, $state, $stateParams, $http, $upload) {
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
          console.log('All Files Uploaded');
          // TODO: Add Socket .send
        });
    };
    //get request to reload with updated files
  });