angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, Projects) {
    $scope.projects = {};

    // on project state initialize, get projects
    $scope.init = function() {
      Projects.getProjects(function(res) {
        $scope.projects.projects = res;
        console.log('users projects in controller', res);
      });
    };

    $scope.init();

  });