/*global angular:true, moment:true */
'use strict';

angular.module('code.chat', ['ui.router', 'ngSanitize', 'luegg.directives'])
  .controller('chatController', function ($rootScope, $location, $anchorScroll, $document, $window, $scope, $state, $http, ngSocket, $stateParams, Auth, $interval, chatFactory, SocketFactory) {
    var roomID = $stateParams.projectName;
    $scope.username = Auth.userName;
    $scope.roomID = roomID;
    $scope.messages = [];
    $scope.emitStartVideo = function () {
      $rootScope.$broadcast('STARTVIDEO');
    };

    chatFactory.getUsers(roomID)
      .then(function (data) {
        $scope.users = data.data.user;
      });

    var updateTime = function () {
      for (var i = 0; i < $scope.messages.length; i = i + 1) {
        $scope.messages[i].timeAgo = moment($scope.messages[i].createdAt).fromNow();
      }
    };

    $interval(updateTime, 15000);

    SocketFactory.joinedRoom(roomID);

    SocketFactory.onMessageHistory(function (eachMessage) {
      $scope.messages.push(eachMessage);
    }, roomID);

    SocketFactory.onChat(function (chatMessage) {
      $scope.messages.push(chatMessage);
    }, roomID);

  })
  .directive('ngEnter', function (SocketFactory) {
    return function ($scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          $scope.$apply(function () {
            var chatParams = {
              type: 'message',
              username: $scope.username,
              roomID: $scope.roomID,
              message: $scope.chatMessage,
              createdAt: Date.now()
            };
            SocketFactory.sendChat(chatParams);
            $scope.$eval(attrs.ngEnter);
          });
          $scope.chatMessage = '';
          event.preventDefault();
        }
      });
    };
  })
  .factory('chatFactory', function ($http) {
    return {
      getUsers: function (projectName) {
        return $http.get('/api/project/' + projectName);
      }
    };
  });