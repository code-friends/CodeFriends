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
          templateUrl: '/app/home/home.html',
          url: '/home'
        })
        .state('home.projectsView', {
          templateUrl: '/app/home/projects/projects.html',
          controller: 'projectsController',
          url: '/projects'
        })
        .state('editor', {
          url: '/editor',
          controller: 'editorController',
          templateUrl: '/app/editor/editor.html'
        });
    });
})();