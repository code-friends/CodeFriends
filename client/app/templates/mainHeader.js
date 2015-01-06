/*global angular:true */
'use strict';

angular.module('code.mainHeaderDirective', [])
  .directive('cfMainHeader', function (Auth) {
    var $scope = {
      'hello': [1,2,3,4,]
    };
    return {
      restrict: 'E',
      templateUrl: '/app/templates/mainHeader.html',
      $scope: $scope
    };
  });