/*global angular:true */
(function () {
  'use strict';
  angular.module('codeFriends', [
      'ui.router',
      'angularFileUpload',
      'codeFriends.projects',
      'codeFriends.userBox',
      'codeFriends.project',
      'codeFriends.toolbar',
      'codeFriends.uploads',
      'codeFriends.document', //not yet refactored
      'codeFriends.services',
      'codeFriends.chat', //not yet refactored
      'codeFriends.video', // not yet refactored
      'codeFriends.mainHeader',
      'ngSocket'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
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
              controller: 'ProjectsController'
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
              controller: 'ProjectController'
            },
            'chat@project': {
              templateUrl: '/app/project/chat/chat.html',
              controller: 'chatController'
            },
            'toolbar@project': {
              templateUrl: '/app/project/toolbar/toolbar.html',
              controller: 'ToolbarController'
            },
            'video@project': {
              templateUrl: '/app/project/chat/video/video.html',
              controller: 'videoController'
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
          controller: 'documentController',
          resolve: {
            authenticated: authenticated
          }
        });
    })
    .run(function ($rootScope, $state, $log) {
      $rootScope.$on('$stateChangeError', function () {
        // $log.debug('Error $stateChangeError');
        $state.go('login');
      });
    });
})();