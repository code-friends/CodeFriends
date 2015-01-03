/*global angular:true, Hashes:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($scope, $state, $stateParams, ToolbarDocument, $rootScope, documentFactory) {
    $scope.projectName = $stateParams.projectName;
    $scope.documentName = $stateParams.documentName;
    $scope.theme = ToolbarDocument.theme;

    // Setup Code Editor
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    documentFactory.goToDocument($scope.projectName, $scope.documentName, cm);

    $scope.$on('theme:changed', function (event, theme) {
      cm.setOption('theme', theme);
    });

  })
  .factory('documentFactory', function () {
    return {
      goToDocument: function (projectName, documentName, codeMirror) {
        var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.config.ports.editor);
        var sjs = new window.sharejs.Connection(ws);
        var str = 'p-' + projectName + '-d' + documentName;
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