/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.landing', ['ui.router'])
    .controller('LandingController', LandingController);

  LandingController.$inject = ['$window'];

  function LandingController($window) {
    var vm = this;
    vm.init = init;
    function init() {
      var wistiaEmbed = window.Wistia.embed('j63zsovroj', {
        version: 'v1',
        autoPlay: true,
        videoFoam: true
      });
      wistiaEmbed.bind('end', function() {
        wistiaEmbed.play();
      });
    }
    init();
  }
})();