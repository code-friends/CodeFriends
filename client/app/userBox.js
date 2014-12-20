/*global angular:true */
angular.module('code.userBox', ['ui.router'])
  .controller('userBox', function ($scope, Auth) {
    Auth.isLoggedIn()
      .then(function () {
        $scope.userLoggedIn = (Auth.userId !== null);
        $scope.userName = Auth.userId;
      });
  });