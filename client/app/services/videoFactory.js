/*global angular:true*/
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('VideoFactory', VideoFactory);

  function VideoFactory() {

    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: false,
      debug: false,
      detectSpeakingEvents: true,
      adjustPeerVolume: true,
      autoAdjustMic: true
    });

    webrtc.startVideo = function () {
      webrtc.startLocalVideo();
    };

    return webrtc;

  }

})();