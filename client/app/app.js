/*global angular:true */
(function () {
  angular.module('code', [
      'ui.router',
      'code.userBox',
      'code.landing',
      'code.login',
      'code.editor',
      'code.projects',
      'code.services'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
            },
            'friends@home': {
              template: '<p>Friends data here<p>'
                // these files do not exist yet
                // templateUrl: '/app/home/friends/friends.html',
                // controller: '/app/home/friends/friends.js'
            }
          }
        })
        .state('projectEditor', {
          url: '/editor/:docID',
          views: {
            '': {
              templateUrl: '/app/projectEditor/projectEditor.html'
            },
            'chat@projectEditor': {
              // templateUrl: '/app/projectEditor/chat/chat.html'
              template: '<p>chat</p>'
                // controller: '/app/projectEditor/chat/chat.js'
            },
            'editor@projectEditor': {
              templateUrl: '/app/projectEditor/editor/editor.html',
              controller: 'editorController'
            }
          }
        });
    });
})();