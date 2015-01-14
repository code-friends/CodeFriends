/*global angular:true, moment:true, _:true */
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('AuthFactory', AuthFactory);

  AuthFactory.$inject = ['$http', '$state', '$q'];

  function AuthFactory($http, $state, $q) {

    var factory = {
      userId: null,
      // userName: null,
      // githubAvatarUrl: null,
      isLoggedIn: isLoggedIn,
      getUserName: getUserName
    };

    return factory;

    function isLoggedIn(redirectToLogin) {
      return $http.get('/auth/user')
        .then(function (res) {
          factory.userId = res.data.userId;
          factory.userName = res.data.userName;
          factory.githubAvatarUrl = res.data.githubAvatarUrl;
          if (res.data.userId === null) {
            if (redirectToLogin !== false) {
              return $state.go('login');
            }
            return false;
          }
          return {
            'userName': factory.userName,
            'userId': factory.userId,
            'githubAvatarUrl': factory.githubAvatarUrl,
          };
        });
    }

    function getUserName() {
      if (factory.userName === undefined) {
        return factory.isLoggedIn();
      } else {
        return $q.when({
          'userName': factory.userName,
          'userId': factory.userId,
          'githubAvatarUrl': factory.githubAvatarUrl
        });
      }
    }

  }

})();