/*global angular:true, CodeMirror:true */
/*jshint browser:true */
angular.module('code.editor', ['ui.router'])
  .controller('editorController', function ($scope, $state, $stateParams) {
    console.log($stateParams.docID);
    $scope.goToHome = function () {
      $state.go('home');
    };
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'paraiso-dark'
    });
    var elem = document.getElementById('pad');
    var ws = new WebSocket('ws://localhost:8007');
    var sjs = new window.sharejs.Connection(ws);
    var collectionName = 'documents';
    var doc = sjs.get(collectionName, $stateParams.docID);
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