/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.userBox', [])
    .controller('UserBoxController', UserBox);

  UserBox.$inject = ['AuthFactory'];

  function UserBox(AuthFactory) {
    var vm = this;
    vm.userLoggedIn = (AuthFactory.userId !== null);
    vm.userName = AuthFactory.userName;
    vm.githubAvatarUrl = AuthFactory.githubAvatarUrl;
  }

})();