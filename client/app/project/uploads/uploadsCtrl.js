/*global angular:true */

angular.module('code.uploads', ['ui.router'])
  .controller('uploadsController', function ($scope, $state, $stateParams, $http, $upload) {

    console.log('1!!!');
    $scope.onFileSelect = function (files) {

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('file: ', file);
        console.log('file.name: ', file.name);
        console.log('$stateParams.projectName: ', $stateParams.projectName);
        $scope.upload = $upload.upload({
            method: 'POST',
            url: '/api/upload',
            data: {
              file_name: file.name,
              project_name: $stateParams.projectName,
              parent_file: null
            },
            file: file
          })
          .progress(function (evt) {
            // console.log(evt);
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          })
          .success(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            // $state.reload();                             
          })
          .error(function (error) {
            console.log('ERROR: ', error);
          })
      }
    };

  });