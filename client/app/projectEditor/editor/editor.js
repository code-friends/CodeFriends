/*global angular:true, CodeMirror:true */
/*jshint browser:true */
angular.module('code.editor', ['ui.router'])
  .controller('editorController', function ($scope, $state) {
    $scope.goToHome = function () {
      $state.go('home');
    };
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true
    });
    var elem = document.getElementById('pad');
    var ws = new WebSocket('ws://localhost:8007');
    var sjs = new window.sharejs.Connection(ws);
    var collectionName = 'documents';
    var documentName = 'doc3';
    var doc = sjs.get(collectionName, documentName);
    // console.log(doc);
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