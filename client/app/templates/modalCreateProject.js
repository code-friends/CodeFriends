/*global angular:true */

(function () {
  'use strict';
  angular.module('codeFriends.projects')
    .controller('createProjectModalController', ['$scope', '$modalInstance', '$upload', 'ProjectListFactory', 'TemplatesFactory', function ($scope, $modalInstance, $upload, ProjectListFactory, TemplatesFactory) {
      $scope.toHide = true;
      $scope.files = null;
      $scope.gitRepoUrl = null;
      $scope.templateList = null;
      $scope.selectedTab = 'gitRepoUrl';
      $scope.templateSelected = 'Choose a template';
      $scope.templateSelectedUrl = null;
      $scope.usingAlreadyLoadedTemplate = false;

      $scope.getTemplateSelected = function (event) {
        $scope.gitRepoUrl = event.target.attributes['data-templateurl'].value;
        $scope.templateSelected = event.target.innerText;
        $scope.usingAlreadyLoadedTemplate = true;
      };

      $scope.onFileSelect = function (files) {
        $scope.files = files;
      };

      $scope.changeCurrentTab = function (tabName) {
        $scope.selectedTab = tabName;
      };

      $scope.updateGitRepo = function (gitRepoUrl) {
        $scope.gitRepoUrl = gitRepoUrl;
      };

      $scope.closeModal = function () {
        if ($scope.newProjectName !== undefined) {
          var projectInfoObj = {};
          // Zip
          if ($scope.selectedTab === 'zipFile' &&
            Array.isArray($scope.files) &&
            $scope.files.length > 0
          ) {
            projectInfoObj = {
              type: 'zipFile',
              file: $scope.files // Array
            };
          }
          // Git Repo or Template from Repo
          if (($scope.selectedTab === 'gitRepoUrl' || $scope.selectedTab === 'template') &&
            typeof $scope.gitRepoUrl === 'string'
          ) {
            projectInfoObj = {
              type: 'gitRepoUrl',
              gitRepoUrl: $scope.gitRepoUrl
            };
          }

          // unhides loading icon
          $scope.toHide = false;

          // NOTE: It would be great if we could give the user some feedback that
          // this might take a while. Git cloning can take a couple of seconds.
          return ProjectListFactory.createProject($scope.newProjectName, projectInfoObj)
            .then(function () {
              // if creating template, post to db as a template
              if ($scope.selectedTab === 'template' && !$scope.usingAlreadyLoadedTemplate) {
                TemplatesFactory.postTemplate($scope.newProjectName, $scope.gitRepoUrl)
                  .then(function () {
                    $modalInstance.close();
                  });
              }
              $scope.toHide = true;
              $modalInstance.close();
            });
        }
      };

      $scope.getTemplates = function () {
        return TemplatesFactory.getTemplates()
          .then(function (templates) {
            $scope.templateList = templates;
          });
      };

      $scope.getTemplates();

    }]);
})();