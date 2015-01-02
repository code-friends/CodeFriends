/*global angular:true */
'use strict';

angular.module('code.mainHeaderDirective', [])
  .directive('cfMainHeader', function () {
    return {
      restrict: 'AE',
      templateUrl: '/app/templates/mainHeader.html'
    };
  });