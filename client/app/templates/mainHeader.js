/*global angular:true */
'use strict';

angular.module('code.mainHeaderDirective', [])
  .directive('cfMainHeader', function () {
    return {
      restrict: 'E',
      templateUrl: '/app/templates/mainHeader.html'
    };
  });