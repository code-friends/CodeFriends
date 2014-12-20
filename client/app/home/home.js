'use strict';
/*global angular:true */
angular.module('code.landing', ['ui.router'])
  .controller('homeController', function ($scope, $state, Auth, $http) {
    Auth.isLoggedIn();
  });