/*global angular:true */
'use strict';

angular.module('codeFriends.mainHeader', [])
  .directive('cfMainHeader', function (AuthFactory) {
    var $scope = {
      'hello': [1, 2, 3, 4, ]
    };
    return {
      restrict: 'E',
      templateUrl: '/app/templates/mainHeader.html',
      $scope: $scope
    };
  });