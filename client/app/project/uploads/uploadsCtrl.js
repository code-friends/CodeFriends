/*global angular:true */

angular.module('code.uploads', ['ui.router'])
  .controller('uploadsController', function ($scope, $state, $stateParams, $http, $upload) {

    $scope.onFileSelect = function (files) {
      var uploadFile = function (fileIndex) {
        return $upload.upload({
            method: 'POST',
            url: '/api/upload',
            data: {
              file_name: files[fileIndex].name,
              project_name: $stateParams.projectName,
              parent_file: null
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
          console.log('All Files UPloaded');
        });
    };
    //get request to reload with updated files
  });