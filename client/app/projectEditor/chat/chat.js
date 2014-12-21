angular.module('code.chat', ['ui.router', 'ui.keypress'])
  .controller('chatController', function ($scope, $state) {
    $scope.doSomething = function () {
      alert("WORK PLZ");
    }
    $scope.keypressCallback = function ($event) {
      alert('Voila!');
      $event.preventDefault();
    };
  })
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });