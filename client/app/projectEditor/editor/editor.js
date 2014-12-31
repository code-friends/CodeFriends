/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.editor', ['ui.router'])
  .controller('editorController', function ($scope, $state, $stateParams, $http) {
    console.log($stateParams.docID);
    $scope.goToHome = function () {
      $state.go('home');
    };
    $scope.addNewFile = function () {
      return $http.post('/api/file', {
        file_name: $scope.newFileName,
        project_name: $stateParams.docID, // Where can we get this from?
        parent_file: null
      });
    };
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'paraiso-dark'
    });
    var elem = document.getElementById('pad');
    var ws = new WebSocket('ws://' + window.location.hostname + ':8007'); // This should be dynamic
    var sjs = new window.sharejs.Connection(ws);
    var collectionName = 'documents'; // project name? This should not be static
    var doc = sjs.get(collectionName, $stateParams.docID);
    doc.subscribe();
    doc.whenReady(function () {
      console.log(doc);
      if (!doc.type) {
        doc.create('text');
      }
      if (doc.type && doc.type.name === 'text') {
        doc.attachCodeMirror(cm);
      }
    });
  });