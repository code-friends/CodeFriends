(function(){
  console.log('app initializing');

  angular.module('code', [
    'ui.router',
    'code.login',
    'code.projects',
    'code.services'
    ])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
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
        });
    });

})();