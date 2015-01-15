/*global angular:true */
(function () {
  'use strict';
  angular.module('codeFriends.mainHeader', [])
    .directive('cfMainHeader', ['AuthFactory', function (AuthFactory) {
      var $scope = {
        'hello': [1, 2, 3, 4, ]
      };
      return {
        restrict: 'E',
        templateUrl: '/app/templates/mainHeader.html',
        $scope: $scope
      };
    }]);
})();