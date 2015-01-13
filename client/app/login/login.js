/*global angular:true */
angular.module('codeFriends.login', ['ui.router'])
  .controller('loginController', function ($scope, $state, Auth) {
    Auth.isLoggedIn();
    // Silence is Beautiful
  });