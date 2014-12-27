angular.module('code.chat', ['ui.router'])
  .controller('chatController', function ($scope, $state, ngSocket) {
    var ws = ngSocket('ws://localhost:8001');
    $scope.messages = [];
    ws.onMessage(function (msg) {
      msg = JSON.parse(msg.data);
      console.log('message received', msg);
      $scope.messages.push(msg);
    });
    ws.send({
      foo: 'bar'
    });

    $scope.doSomething = function () {
      console.log($scope.chatMessage);
      ws.send({
        foo: $scope.chatMessage
      });
      $scope.chatMessage = '';
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