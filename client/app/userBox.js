/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.userBox', [])
    .controller('userBox', UserBox);

  UserBox.$inject = ['Auth'];

  function UserBox(Auth) {
    var vm = this;
    vm.userLoggedIn = (Auth.userId !== null);
    vm.userName = Auth.userName;
    vm.githubAvatarUrl = Auth.githubAvatarUrl;
  }

})();