/*global angular:true */

angular.module('code.toolbar', [])
  .controller('toolbarController', function ($scope, $state, $stateParams, $http) {
    $scope.addUser = function () {
      return $http.put('api/project/addUser', {
          newUserName: $scope.newUser,
          project_name: $stateParams.projectName
        })
        .catch(function (error) {
          console.log('error!!!!', error);
          // console.log('Added User');
        });
    };
  });