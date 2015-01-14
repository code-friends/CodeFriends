/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.projects', ['ui.router'])
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$http', 'ProjectListFactory', '$modal', '$timeout'];

  function ProjectsController($http, ProjectListFactory, $modal, $timeout) {
    var vm = this;
    vm.projects = null;
    vm.createProject = createProject;
    vm.openCreateProjectModal = openCreateProjectModal;
    vm.closeModal = closeModal;

    function init() {
      return ProjectListFactory.getProjects()
        .then(function (projects) {
          vm.projects = projects;
          return vm.projects;
        });
    }

    function createProject(projectName) {
      return ProjectListFactory.createProject(projectName);
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

    function closeModal() {
      if (vm.newProjectName !== undefined) {
        var projectInfoObj = {};
        // Zip
        if (vm.selectedTab === 'zipFile' &&
          Array.isArray(vm.files) &&
          vm.files.length > 0
        ) {
          projectInfoObj = {
            type: 'zipFile',
            file: vm.files // Array
          };
        }
        // Git Repo
        if (vm.selectedTab === 'gitRepoUrl' &&
          typeof vm.gitRepoUrl === 'string'
        ) {
          projectInfoObj = {
            type: 'gitRepoUrl',
            gitRepoUrl: vm.gitRepoUrl
          };
        }
        // NOTE: It would be great if we could give the user some feedback that
        // this might take a while. Git cloning can take a couple of seconds.
        ProjectListFactory.createProject(vm.newProjectName, projectInfoObj)
          .then(function () {
            //  $modalInstance.close();
          });
      }
    }
    init();
  }

})();