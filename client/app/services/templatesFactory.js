/*global angular:true*/
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('TemplatesFactory', TemplatesFactory);

  TemplatesFactory.$inject = ['$http'];

  function TemplatesFactory($http) {

    var factory = {
      getTemplates: getTemplates,
      postTemplate: postTemplate
    };

    return factory;

    function getTemplates() {
      return $http.get('api/template/')
        .then(function (res) {
          return res.data;
        });
    }

    function postTemplate(templateName, templateUrl) {
      return $http.post('api/template/', {
          templateName: templateName,
          gitRepoUrl: templateUrl
        })
        .then(function (res) {
          console.log('res from postTemplate', res);
        })
        .catch(function (err) {
          console.log('Error posting template from TemplatesFactory', err);
        });
    }
  }

})();