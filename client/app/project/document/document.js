/*global angular:true, Hashes:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($scope, $stateParams, ToolbarDocument, documentFactory) {
    $scope.projectName = $stateParams.projectName;
    $scope.documentPath = $stateParams.documentPath;
    $scope.theme = ToolbarDocument.theme;

    // Setup Code Editor
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    documentFactory.goToDocument($scope.projectName, $scope.documentPath, cm);
    // listens for theme variable changed in ToolbarDocument factory broadcasted by $rootScope
    $scope.$on('theme:changed', function (event, theme) {
      cm.setOption('theme', theme);
    });

  })
  .factory('documentFactory', function (Projects) {
    return {
      goToDocument: function (projectName, documentPath, codeMirror) {
        var projectId = Projects.getProjectId(projectName);
        var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.config.ports.editor);
        var sjs = new window.sharejs.Connection(ws);
        var str = 'p-' + projectId + '-d' + documentPath;
        var documentHash = new Hashes.SHA256().hex(str);
        var doc = sjs.get('documents', documentHash);
        doc.subscribe();
        doc.whenReady(function () {
          if (!doc.type) {
            doc.create('text');
          }
          if (doc.type && doc.type.name === 'text') {
            doc.attachCodeMirror(codeMirror);
          }
        });
      }
    };
  });