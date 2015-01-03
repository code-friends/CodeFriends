/*global angular:true */

angular.module('code.uploads', ['ui.router'])
  .controller('uploadsController', function ($scope, $state, $stateParams, $http, $upload) {

    // console.log('1!!!');
    // $scope.onFileSelect = function (files) {

    // for (var i = 0; i < files.length; i++) {
    //   var file = files[i];
    //   console.log(file);
    //   $scope.upload = $upload.upload({
    //       method: 'POST', //////
    //       url: 'api/photos/', //////
    //       data: {
    //         prompt_id: 'XX', //$scope.imageId, //////
    //         user_id: 'XX' //Auth.currentUser //////   
    //       },
    //       file: file
    //     })
    //     .progress(function (evt) {
    //       // console.log(evt);
    //       console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    //     })
    //     .success(function (data, status, headers, config) {
    //       // Edit.imageId.push(data);
    //       // $scope.imageNamesToDisplay = Edit.imageId;
    //       // console.log($scope.imageNamesToDisplay);
    //       // console.log("Edit.imageId is: ", Edit.imageId);
    //       console.log(status);
    //       console.log(headers);
    //       console.log(config);
    //       // $state.reload();                             
    //     })
    //     .error(function (error) {
    //       console.log('ERROR: '.error);
    //     })
    //   }
    // };

  });