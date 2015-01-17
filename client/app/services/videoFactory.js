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