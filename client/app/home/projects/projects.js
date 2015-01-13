/*global angular:true, moment:true */
(function () {
  'use strict';

  angular.module('codeFriends.projects', ['ui.router'])
    .controller('projectsController', Projects);

  Projects.$inject = ['$http', 'ProjectsFactory', 'chatFactory', '$modal', '$timeout'];

  function Projects($http, ProjectsFactory, chatFactory, $modal, $timeout) {
    var vm = this;
    vm.projects = null;
    vm.createProject = createProject;
    vm.openCreateProjectModal = openCreateProjectModal;


    function init() {
      return ProjectsFactory.getProjects()
        .then(function (projects) {
          vm.projects = projects;
          return vm.projects;
        });
    }

    function createProject(projectName) {
      return ProjectsFactory.createProject(projectName);
    }

    function openCreateProjectModal() {
      $modal.open({
        templateUrl: '/app/templates/modalCreateProject.html',
        controller: 'createProjectModalController',
        size: 'sm'
      }).result.then(function () {
        vm.init();
      });
    }

    init();
  }
})();