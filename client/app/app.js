/*global angular:true */
(function () {
  'use strict';
  angular.module('codeFriends', [
      'ui.router',
      'angularFileUpload',
      'codeFriends.services',
      'codeFriends.projects',
      'codeFriends.userBox',
      'codeFriends.fileStructure',
      'codeFriends.toolbar',
      'codeFriends.uploads',
      'codeFriends.document',
      'codeFriends.chat',
      'codeFriends.video',
      'codeFriends.mainHeader',
      'ngSocket'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      // $locationProvider.html5Mode(true);
      var authenticated = ['$q', 'AuthFactory', function ($q, AuthFactory) {
        var deferred = $q.defer();
        AuthFactory.isLoggedIn(false)
          .then(function (isLoggedIn) {
            if (isLoggedIn) {
              deferred.resolve();
            } else {
              deferred.reject('Not logged in');
            }
          });
        return deferred.promise;
      }];
      $stateProvider
        .state('landing', {
          templateUrl: '/app/landing/landing.html',
          url: '/'
        })
        .state('login', {
          templateUrl: '/app/login/login.html',
          url: '/login',
        })
        .state('home', {
          url: '/home',
          views: {
            '': {
              templateUrl: '/app/home/home.html'
            },
            'projects@home': {
              templateUrl: '/app/home/projects/projects.html',
            }
          },
          resolve: {
            authenticated: authenticated
          }
        })
        .state('project', {
          url: '/project/:projectId/:projectName/',
          views: {
            '': {
              templateUrl: '/app/project/project.html',
            },
            'fileStructure@project': {
              templateUrl: '/app/project/fileStructure/fileStructure.html',
            },
            'chat@project': {
              templateUrl: '/app/project/chat/chat.html',
            },
            'toolbar@project': {
              templateUrl: '/app/project/toolbar/toolbar.html',
            },
            'video@project': {
              templateUrl: '/app/project/chat/video/video.html',
            }
          },
          resolve: {
            authenticated: authenticated
          }
        })
        .state('document', {
          parent: 'project',
          url: 'document/:documentPath',
          templateUrl: '/app/project/document/document.html',
          controller: 'DocumentController',
          resolve: {
            authenticated: authenticated
          }
        });
    })
    .run(function ($rootScope, $state) {
      $rootScope.$on('$stateChangeError', function (err, req) {
        $state.go('login');
      });
    });
})();