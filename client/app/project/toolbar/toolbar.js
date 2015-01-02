/*global angular:true */
angular.module('code.toolbar', [])
  .controller('toolbarController', function ($scope, $state, $stateParams, $http) {
    console.log('toolbar controller initialized!');

    $scope.addUser = function () {
      console.log('called addUser()');
      console.log('$scope.newUser !!!!!!!!!', $scope.newUser);
      console.log('$stateParams.projectName !!!!!!!!!!', $stateParams.projectName);
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