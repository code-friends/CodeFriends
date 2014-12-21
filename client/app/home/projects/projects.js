/*global angular:true */
angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects) {
    $scope.projects = {};

    // on project state initialize, get projects
    $scope.init = function () {
      Projects.getProjects(function (res) {
        $scope.projects = res;
        console.log('users projects in controller', res);
      });
    };

    $scope.createProject = function () {
      return $http.post('/api/project', {
        project_name: $scope.newProjectName
      }).then(function (res) {
        return res.data;
      }).then(function () {
        return Projects.getProjects(function (res) {
          $scope.projects = res;
        });
      });
    };

    $scope.init();

  });