(function(){
  console.log('app initializing');

  angular.module('code', [
    'ui.router',
    'code.login'
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
          // controller: 'homeController',
          url: '/home'
        })
    });

})();