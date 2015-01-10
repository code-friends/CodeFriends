/*global angular:true */
'use strict';
(function () {
  angular.module('code', [
      'ui.router',
      'angularFileUpload',
      'code.userBox',
      'code.landing',
      'code.home',
      'code.login',
      'code.project',
      'code.projects',
      'code.toolbar',
      'code.uploads',
      'code.downloads',
      'code.document',
      'code.services',
      'code.chat',
      'code.video',
      'code.mainHeaderDirective',
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
          controller: 'landingController',
          url: '/'
        })
        .state('login', {
          templateUrl: '/app/login/login.html',
          controller: 'loginController',
          url: '/login',
        })
        .state('home', {
          url: '/home',
          views: {
            '': {
              templateUrl: '/app/home/home.html',
              controller: 'homeController',
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
          url: '/project/:projectName/:projectId',
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