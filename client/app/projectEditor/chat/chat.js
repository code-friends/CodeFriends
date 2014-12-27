angular.module('code.chat', ['ui.router'])
  .controller('chatController', function ($scope, $state, ngSocket) {
    var ws = ngSocket('ws://localhost:8001');
    ws.onMessage(function (msg) {
      console.log('message received', msg);
    });
    ws.send({
      foo: 'bar'
    });

    $scope.doSomething = function () {
      ws.send({
        foo: 'LOLOLOL'
      });
      ws.send({
        message: 'WHAT'
      });
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