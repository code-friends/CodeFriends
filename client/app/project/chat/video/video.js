/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.video', ['ngSanitize'])
    .controller('VideoController', VideoController);

  VideoController.$inject = ['$scope', '$state', '$http', 'ngSocket', '$stateParams', 'AuthFactory', 'VideoFactory'];

  function VideoController($scope, $state, $http, ngSocket, $stateParams, AuthFactory, VideoFactory) {
    var roomID = $stateParams.projectName;

    var comm = new IceComm('SlMXTAEgn5hs1ITxylVfrhi1wh4StgGLeDHrMxEpsaGRsOa');

    $scope.$on('STARTVIDEO', function () {
      comm.connect(roomID);
    });

    comm.on('connected', function (options) {
      createRemoteVideo(options.stream, options.callerID);
    });

    comm.on('local', function (options) {
      localVideo.src = options.stream;
    });

    comm.on('disconnect', function (options) {
      document.getElementById(options.callerID).remove();
    });

    function createRemoteVideo(stream, key) {
      var remoteVideo = document.createElement('video');
      remoteVideo.src = stream;
      remoteVideo.id = key;
      remoteVideo.autoplay = true;
      remoteVideo.className = ("remoteContainer");
      var findRemotesID = document.getElementById('remotes');
      findRemotesID.appendChild(remoteVideo);
    }
  };
})();