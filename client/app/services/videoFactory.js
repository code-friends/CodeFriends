<<<<<<< HEAD
/*global angular:true*/
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('VideoFactory', VideoFactory);

  function VideoFactory() {

    console.log('Start SimpleWebRTC');
    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remotes',
      // immediately ask for camera access
      url: 'http://docker.dev:9003',
      autoRequestMedia: true,
      detectSpeakingEvents: false,
      debug: true,
    });
    window.webrtc = webrtc;

    webrtc.startVideo = function () {
      webrtc.startLocalVideo();
    };

    return webrtc;

  }

})();
=======
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
      console.log(iceComm.getLocalID());


      iceComm.on('connected', function (options) {
        createRemoteVideo(options.stream, options.callerID);
        console.log("THESE ARE THE CONNECTED ", options);
      });

      iceComm.on('local', function (options) {
        localVideo.src = options.stream;
        console.log("these are the local options", options);
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
        console.log(iceComm);
      }

      window.isVideoOn = false;

      return iceComm;
    }
  })();
>>>>>>> file structure refreshes and video stream stopped going to projects
