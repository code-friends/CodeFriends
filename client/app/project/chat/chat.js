/*global angular:true */
'use strict';

angular.module('code.chat', ['ui.router'])
  .controller('chatController', function ($scope, $state, ngSocket, $stateParams) {
    var roomID = $stateParams.projectName;
    var ws = ngSocket('ws://localhost:8001');

    $scope.roomID = roomID;
    $scope.messages = [];

    ws.onOpen(function () {
      ws.send({
        type: 'joinRoom',
        roomID: roomID
      });
    });
    ws.onMessage(function (msg) {
      msg = JSON.parse(msg.data);
      if (msg.roomID === roomID) {
        if (msg.type === 'msgHistory') {
          for (var i = 0; i < msg.messages.length; i++) {
            $scope.messages.push(msg.messages[i]);
          }
        }
      }
      if (msg.hasOwnProperty('message')) {
        if (msg.message.roomID === roomID) {
          $scope.messages.push({
            username: msg.message.username,
            roomID: msg.message.roomID,
            message: msg.message.message
          });
        }
      }
    });
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