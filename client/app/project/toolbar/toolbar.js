/*global angular:true */
angular.module('code.toolbar', [])
  .controller('toolbarController', function ($scope, $state, $stateParams, $http) {
    console.log('toolbar controller initialized!');
    $scope.addUser = function () {
      console.log('called addUser()');
      return $http.put('/api/project/addUser/', { //correct path?
          file_name: $scope.newUser,
          project_name: $stateParams.projectName, // Where can we get this from?
        })
        .then(function () {
          console.log('Added User');
        });
    };
  });