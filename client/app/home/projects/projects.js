/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.projects', ['ui.router'])
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$http', 'ProjectListFactory', '$modal', '$timeout', 'SocketFactory'];

  function ProjectsController($http, ProjectListFactory, $modal, $timeout, SocketFactory) {
    var vm = this;
    vm.projects = null;
    vm.createProject = createProject;
    vm.deleteProject = deleteProject;
    vm.openCreateProjectModal = openCreateProjectModal;

    // Close Socket Connection
    SocketFactory.leaveRoom();

    function init() {
      return ProjectListFactory.getProjects()
        .then(function (projects) {
          vm.projects = projects;
          return vm.projects;
        });
    }

    function deleteProject($event, project) {
      $event.preventDefault();
      $event.stopPropagation();
      return ProjectListFactory.deleteProject(project.projectName)
        .then(function () {
          init();
        });
    }

    function createProject(projectName) {
      return ProjectListFactory.createProject(projectName)
        .then(function () {
          init();
        });
    }

    function openCreateProjectModal() {
      $modal.open({
        templateUrl: '/app/templates/modalCreateProject.html',
        controller: 'createProjectModalController',
        size: 'sm'
      }).result.then(function () {
        init();
      });
    }

    init();
  }

})();