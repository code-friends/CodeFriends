/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.video', ['ngSanitize'])
    .controller('VideoController', VideoController);

  VideoController.$inject = ['$scope', '$state', '$stateParams', 'VideoFactory'];

  function VideoController($scope, $state, $stateParams, VideoFactory) {
    var roomID = $stateParams.projectName;

    $scope.$on('STARTVIDEO', function () {
      VideoFactory.connect(roomID);
      window.isVideoOn = true;
    });
  };
})();