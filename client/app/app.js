/*global angular:true */
'use strict';

(function () {
  angular.module('code', [
      'ui.router',
      'code.userBox',
      'code.landing',
      'code.home',
      'code.login',
      'code.project',
      'code.projects',
      'code.toolbar',
      'code.document',
      'code.services',
      'code.chat',
      'ngSocket'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('landing', {
          templateUrl: '/app/landing/landing.html',
          controller: 'landingController',
          url: '/'
        })
        .state('login', {
          templateUrl: '/app/login/login.html',
          controller: 'loginController',
          url: '/login'
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
          }
        })
        .state('project', {
          url: '/project/:projectName/',
          views: {
            '': {
              templateUrl: '/app/project/project.html',
              controller: 'projectController'
            },
            'chat@project': {
              templateUrl: '/app/project/chat/chat.html',
              controller: 'chatController'
            },
            'toolbar@project': {
              templateUrl: '/app/project/toolbar/toolbar.html',
              controller: 'toolbarController'
            }
          }
        })
        .state('document', {
          parent: 'project',
          url: 'document/:documentName',
          templateUrl: '/app/project/document/document.html',
          controller: 'documentController'
        });
    });
})();