/*global angular:true */

// OAuth.initialize('ZN6SO1Y6vAJpwkzvr1xK294arr8');
// https://oauth.io/docs/api-reference/client/javascript

angular.module('code.login', ['ui.router'])
  .controller('loginController', function ($scope, $state) {
    console.log('Login Controller');
    $scope.goToHome = function () {
      $state.go('home');
    };
  });