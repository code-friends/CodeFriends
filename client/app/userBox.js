/*global angular:true */
'use strict';

angular.module('codeFriends.userBox', ['ui.router'])
  .controller('userBox', function ($scope, Auth) {
    $scope.userLoggedIn = (Auth.userId !== null);
    $scope.userName = Auth.userName;
    $scope.githubAvatarUrl = Auth.githubAvatarUrl;
  });