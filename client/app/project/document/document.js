/*global angular:true, Hashes:true, CodeMirror:true, _:true */
/*jshint browser:true */
(function () {
  'use strict';
  angular.module('codeFriends.document', [])
    .controller('DocumentController', DocumentController);

  DocumentController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', 'ToolbarFactory', 'DocumentFactory'];

  function DocumentController($scope, $rootScope, $http, $stateParams, ToolbarFactory, DocumentFactory) {
    $scope.projectName = $stateParams.projectName;
    $scope.documentPath = $stateParams.documentPath;
    $scope.theme = ToolbarFactory.theme;
    $scope.language = '';
    $scope.theme = ToolbarFactory.theme;

    $rootScope.$on('compile code', function ($event) {
      var postObj = {
        'language': DocumentFactory.getFileCode($scope.documentPath),
        'code': $scope.cm.getValue()
      };
      $http
        .post('https://compile.remoteinterview.io/compile/', postObj).success(function (data) {
          var output = data.output.split(/\n/g);
          for (var i = 0; i < output.length - 1; i++) {
            console.log('Output: ', output[i]);
          }
        })
        .error(function () {
          // console.log('Error Compiling User Code. Please Try Again.')
        });
    });
    // Setup Code Editor
    var documentPathSplit = $scope.documentPath.split('.');
    var fileExtension = documentPathSplit[documentPathSplit.length - 1];
    var fileMode = CodeMirror.findModeByName(fileExtension);
    var mode = null;
    if (typeof fileMode === 'object' && fileMode.mode !== undefined) {
      mode = fileMode.mode;
    }
    $scope.cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: mode,
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    // listens for theme variable changed in ToolbarDocument factory broadcasted by $rootScope
    DocumentFactory.goToDocument($scope.projectName, $scope.documentPath, $scope.cm);
    $scope.$on('theme:changed', function (event, theme) {
      $scope.cm.setOption('theme', theme);
    });

  }
})();