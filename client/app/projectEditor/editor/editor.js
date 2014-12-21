/*global angular:true, CodeMirror:true */
/*jshint browser:true */
angular.module('code.editor', ['ui.router'])
  .controller('editorController', function ($scope, $state, $stateParams, $http) {
    console.log($stateParams.docID);
    $scope.goToHome = function () {
      $state.go('home');
    };
    $scope.addNewFile = function () {
      return $http.post('/api/project/file', {
        file_name: $scope.newFileName,
        project_name: $scope.projectName, // Where can we get this from?
        parent_file: null
      });
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