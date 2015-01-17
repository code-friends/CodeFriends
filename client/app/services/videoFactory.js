  /*global angular:true, moment:true, _:true */

  /*global angular:true*/

  (function () {
    'use strict';

    angular.module('codeFriends.services')
      .factory('VideoFactory', VideoFactory);
    VideoFactory.$inject = [];

    function VideoFactory() {
      var iceComm;

      iceComm = new IceComm('SlMXTAEgn5hs1ITxylVfrhi1wh4StgGLeDHrMxEpsaGRsOa');

      iceComm.on('connected', function (options) {
        createRemoteVideo(options.stream, options.callerID);
      });

      iceComm.on('local', function (options) {
        localVideo.src = options.stream;
      });

      iceComm.on('disconnect', function (options) {
        document.getElementById(options.callerID).remove();
      });

      function createRemoteVideo(stream, key) {
        var remoteVideo = document.createElement('video');
        remoteVideo.src = stream;
        remoteVideo.id = key;
        remoteVideo.autoplay = true;
        remoteVideo.className = ('remoteContainer');
        var findRemotesID = document.getElementById('remotes');
        findRemotesID.appendChild(remoteVideo);
      }

      window.isVideoOn = false;

      return iceComm;
    }
  })();