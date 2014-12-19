(function(){
  console.log('app initializing');

  angular.module('code', [
    'ui.router'
    ])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('editor', {
          url: "/editor", 
          templateUrl: "app/editor/index.html"
        })
    })
})();