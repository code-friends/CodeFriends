/*global angular:true, Hashes:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($scope, $state, $stateParams, ToolbarDocument, $rootScope) {
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
    var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.config.ports.editor); // This should be dynamic
    var sjs = new window.sharejs.Connection(ws);
    // Connect to document
    /**
     * We use a hash to call up the document
     * We do this in order to keep the `document` collection flat
     */
    var str = 'p-' + $scope.projectName + '-d' + $scope.documentName;
    var documentHash = new Hashes.SHA256().hex(str);
    var doc = sjs.get('documents', documentHash);
    doc.subscribe();
    doc.whenReady(function () {
      if (!doc.type) {
        doc.create('text');
      }
      if (doc.type && doc.type.name === 'text') {
        doc.attachCodeMirror(cm);
      }
    });

    $scope.$on('theme:changed', function (event, theme) {
      cm.setOption('theme', theme);
    });

  });