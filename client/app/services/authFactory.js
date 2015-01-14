/*global angular:true, moment:true, _:true */
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('AuthFactory', AuthFactory);

  AuthFactory.$inject = ['$http', '$state', '$q'];

  function AuthFactory($http, $state, $q) {

    var factory = {
      userId: null,
      userName: null,
      githubAvatarUrl: null,
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


// .factory('AuthFactory', function ($http, $state, $q) {
//     var AuthFactory = {
//       isLoggedIn: function (redirectToLogin) {
//         return $http.get('/auth/user')
//           .then(function (res) {
//             AuthFactory.userId = res.data.userId;
//             AuthFactory.userName = res.data.userName;
//             AuthFactory.githubAvatarUrl = res.data.githubAvatarUrl;
//             if (res.data.userId === null) {
//               if (redirectToLogin !== false) {
//                 return $state.go('login');
//               }
//               return false;
//             }
//             return {
//               'userName': AuthFactory.userName,
//               'userId': AuthFactory.userId,
//               'githubAvatarUrl': AuthFactory.githubAvatarUrl,
//             };
//           });
//       },
//       getUserName: function () {
//         if (AuthFactory.userName === undefined) {
//           return AuthFactory.isLoggedIn();
//         } else {
//           return $q.when({
//             'userName': AuthFactory.userName,
//             'userId': AuthFactory.userId,
//             'githubAvatarUrl': AuthFactory.githubAvatarUrl
//           });
//         }
//       },
//       userId: null
//     };
//     return AuthFactory;
//   })