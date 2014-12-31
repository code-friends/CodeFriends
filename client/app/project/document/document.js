/*global angular:true, bCrypt:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($scope, $state, $stateParams) {
    console.log('Document ID: ', $stateParams.projectName);
    console.log('File Name: ', $stateParams.documentName);
    var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      value: 'alert(\'hello world\')',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'paraiso-dark'
    });

    bCrypt.hashpw('hello', 'salt', function (hash) {
      console.log('hash: ', hash);
    });

    var elem = document.getElementById('pad');
    var ws = new WebSocket('ws://' + window.location.hostname + ':8007'); // This should be dynamic
    var sjs = new window.sharejs.Connection(ws);
    var collectionName = 'documents'; // project name? This should not be static
    var doc = sjs.get(collectionName, $stateParams.projectName);
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