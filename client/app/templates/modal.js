/*global angular:true */
'use strict';

// angular.module('code.modal', [])
// .directive('modalAddFile', function () {
//   return {
//     restrict: 'E',
//     scope: {
//       show: '=show'
//     },
//     templateUrl: '/app/templates/modal-addFile.html',
//     // replace: true, // Replace with the template below
//     // transclude: true, // we want to insert custom content inside the directive
//     link: function (scope, element, attrs) {
//       scope.dialogStyle = {};
//       if (attrs.width) {
//         scope.dialogStyle.width = attrs.width;
//       }
//       if (attrs.height) {
//         scope.dialogStyle.height = attrs.height;
//       }
//       scope.hideModal = function () {
//         scope.show = false;
//       };
//     }
//   };
// });
// .directive('modalDialog', function () {
//   return {
//     restrict: 'E',
//     scope: {
//       show: '='
//     },
//     replace: true, // Replace with the template below
//     transclude: true, // we want to insert custom content inside the directive
//     link: function (scope, element, attrs) {
//       scope.dialogStyle = {};
//       if (attrs.width)
//         scope.dialogStyle.width = attrs.width;
//       if (attrs.height)
//         scope.dialogStyle.height = attrs.height;
//       scope.hideModal = function () {
//         scope.show = false;
//       };
//     },
//     // template: '<div class="ng-modal" ng-show="show"><div class="ng-modal-overlay" ng-click="hideModal()"></div><div class="ng-modal-dialog" ng-style="dialogStyle"><div class="ng-modal-close" ng-click = 'hideModal()' > X < /div> < div class = 'ng-modal-dialog-content'
//     // ng - transclude > < /div> < /div></div > "
//     templateUrl: '/app/templates/modal-addFile.html'
//   };
// });