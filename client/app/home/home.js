/*global angular:true */
angular.module('code.landing', ['ui.router'])
  .controller('homeController', function ($scope, $state, Auth, $http) {
    Auth.isLoggedIn();
    $scope.createProject = function () {
      return $http.post('/api/project', {
        project_name: $scope.newProjectName
      }).then(function (res) {
        return res.data;
      });
    };
  });