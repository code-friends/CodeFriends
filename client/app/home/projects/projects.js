/*global angular:true */
angular.module('code.projects', ['ui.router'])
  .controller('projectsController', function ($scope, $state, $http, Projects) {

    // on project state initialize, get projects
    $scope.init = function () {

      Projects.getProjects(function (res) {
        $scope.projects = res;
      });

    };

    $scope.createProject = function () {
      console.log('$scope.newProjectName !!!!!!', $scope.newProjectName);
      return $http.post('/api/project', {
          project_name: $scope.newProjectName
        })
        .then(function (res) {
          console.log('RES !!!!!!', res);
          return res.data;
        })
        .then(function () {
          return Projects.getProjects(function (res) {
            $scope.projects = res;
            console.log('RES $scope.projects !!!!!', $scope.projects);
          });

        });

      $scope.init();
    };
    $scope.init();
  });