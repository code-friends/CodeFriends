/*global angular:true */
'use strict';

angular.module('code.chat', ['ui.router'])
  .controller('chatController', function ($scope, $state, ngSocket, $stateParams) {
    var roomID = $stateParams.docID;
    $scope.roomID = roomID;
    var ws = ngSocket('ws://' + window.location.hostname + ':8001');
    $scope.messages = [];
    ws.onMessage(function (msg) {
      console.log(msg);
      msg = JSON.parse(msg.data);
      if (msg.message.hasOwnProperty(roomID)) {
        $scope.messages.push(msg);
      }
    });
    $scope.doSomething = function () {
      var params = {};
      params[roomID] = $scope.chatMessage;
      ws.send(params);
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