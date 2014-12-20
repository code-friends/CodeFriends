/*global angular:true */
(function () {
  console.log('app initializing');
  angular.module('code', [
      'ui.router',
      'code.login',
      'code.editor',
      'code.projects',
      'code.services'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
      console.log('App Config');
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('login', {
          templateUrl: '/app/login/login.html',
          controller: 'loginController',
          url: '/login'
        })
        .state('home', {
          url: '/home',
          views: {
            '': { templateUrl: '/app/home/home.html' },
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
        .state('editor', {
          url: '/editor',
          controller: 'editorController',
          templateUrl: '/app/editor/editor.html'
        });
    });
})();