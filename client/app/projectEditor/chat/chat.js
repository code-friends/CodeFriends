angular.module('code.chat', ['ui.router'])
  .controller('chatController', function ($scope, $state, ngSocket, $stateParams, Auth) {
    var roomID = $stateParams.docID;
    var userName = Auth.userName;
    var ws = ngSocket('ws://localhost:8001');

    $scope.roomID = roomID;
    $scope.messages = [];

    ws.onOpen(function (onOpen) {
      ws.send({
        type: 'joinRoom',
        roomID: roomID
      });
    });
    ws.onMessage(function (msg, options) {
      console.log(msg);
      msg = JSON.parse(msg.data);
      console.log("2", msg);

      if (msg.roomID === roomID) {
        if (msg.type === "msgHistory") {
          for (var i = 0; i < msg.messages.length; i++) {
            $scope.messages.push(msg.messages[i])
          }
          console.log('we made it here', $scope.messages);
        }
      }
      if (msg.hasOwnProperty("message")) {
        if (msg.message.roomID === roomID) {
          console.log('we got to the message', msg)
          $scope.messages.push({
            username: msg.message.username,
            roomID: msg.message.roomID,
            message: msg.message.message
          });
        }
      }
    });
    $scope.doSomething = function () {
      var params = {
        type: 'message',
        username: userName,
        roomID: roomID,
        message: $scope.chatMessage
      };
      ws.send(params);
      $scope.chatMessage = '';
    };

  })
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });