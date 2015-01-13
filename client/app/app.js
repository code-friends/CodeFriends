/*global angular:true */
(function () {
  'use strict';
  angular.module('codeFriends', [
      'ui.router',
      'angularFileUpload',
      // module dependencies are passed down to following modules, ui.router in codeFriends.projects passes down
      'codeFriends.projects',
      'codeFriends.userBox',
      'codeFriends.project',
      'codeFriends.toolbar',
      'codeFriends.uploads',
      'codeFriends.downloads',
      'codeFriends.document',
      'codeFriends.services',
      'codeFriends.chat',
      'codeFriends.video',
      'codeFriends.mainHeaderDirective',
      // 'codeFriends.createProjectModalController',
      'ngSocket'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      var authenticated = ['$q', 'Auth', function ($q, Auth) {
        var deferred = $q.defer();
        Auth.isLoggedIn(false)
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
              controller: 'projectsController'
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
              // controller: 'projectController'
            },
            'fileStructure@project': {
              templateUrl: '/app/project/fileStructure/fileStructure.html',
              controller: 'projectController'
            },
            'chat@project': {
              templateUrl: '/app/project/chat/chat.html',
              controller: 'chatController'
            },
            'toolbar@project': {
              templateUrl: '/app/project/toolbar/toolbar.html',
              controller: 'toolbarController'
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