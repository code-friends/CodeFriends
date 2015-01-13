/*global angular:true, Hashes:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($rootScope, $scope, $stateParams, ToolbarDocument, documentFactory) {
    $rootScope.$on('compile code', function () {
      console.log($scope.cm.getValue());
      var fn = window[$scope.cm.getValue()];
      eval($scope.cm.getValue());
    });
    $scope.projectName = $stateParams.projectName;
    $scope.documentPath = $stateParams.documentPath;
    $scope.theme = ToolbarDocument.theme;

    // Setup Code Editor
    $scope.cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    documentFactory.goToDocument($scope.projectName, $scope.documentPath, $scope.cm);
    // listens for theme variable changed in ToolbarDocument factory broadcasted by $rootScope
    $scope.$on('theme:changed', function (event, theme) {
      $scope.cm.setOption('theme', theme);
    });

  })
  .factory('documentFactory', function (Projects, $state, $stateParams) {
    return {
      goToDocument: function (projectName, filePath, codeMirror) {
          var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.config.ports.editor);
          var sjs = new window.sharejs.Connection(ws);
          /**
           * Look in getDocumentHash before changing this
           */
          if (filePath[0] !== '/') {
            filePath = '/' + filePath;
          }
          var str = 'p-' + $stateParams.projectId + '-d' + filePath;
          var filePathHash = new Hashes.SHA256().hex(str);
          var doc = sjs.get('documents', filePathHash);
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
        // getDocumentText = function (projectName, filePath, codeMirror) {
        //   var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.config.ports.editor);
        //   var sjs = new window.sharejs.Connection(ws);
        //   if (filePath[0] !== '/') {
        //     filePath = '/' + filePath;
        //   }
        //   var str = 'p-' + $stateParams.projectId + '-d' + filePath;
        //   var filePathHash = new Hashes.SHA256().hex(str);
        //   var doc = sjs.get('documents', filePathHash);
        //   return doc.getText();
        // }
    };
  });