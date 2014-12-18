(function(){
  console.log('app initializing');

  angular.module('code', [

    ])
    .config(function($stateprovider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');


      $stateprovider
        .state('login', {
          templateUrl: ''
        })
        .state('editor', {
          templateUrl: ''
        })
    })

})();