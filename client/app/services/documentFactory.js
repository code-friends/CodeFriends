/*global angular:true */
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('DocumentFactory', DocumentFactory);

  DocumentFactory.$inject = ['$state', '$stateParams'];

  function DocumentFactory($state, $stateParams) {

    var factory = {
      languageList: languageList,
      goToDocument: goToDocument,
      getFileCode: getFileCode,
    };
    var languageList = {
      'C#': {
        code: 10,
        extensions: ['cs']
      },
      'C++"': {
        code: 7,
        extensions: ['cpp']
      },
      'Clojure': {
        code: 2,
        extensions: ['clj']
      },
      'Java': {
        code: 8,
        extensions: ['java']
      },
      'Go': {
        code: 6,
        extensions: ['cpp']
      },
      'JavaScript': {
        code: 4,
        extensions: ['js']
      },
      'PHP': {
        code: 3,
        extensions: ['php']
      },
      'Python': {
        code: 0,
        extensions: ['py']
      },
      'Ruby': {
        code: 1,
        extensions: ['rb']
      },
      'Scala': {
        code: 5,
        extensions: ['scala']
      },
      'VB.NET': {
        code: 9,
        extensions: ['vb']
      },
      'Shell': {
        code: 11,
        extensions: ['sh']
      },
      'Objective C': {
        code: 12,
        extensions: ['m']
      }
    };

    function goToDocument(projectName, filePath, codeMirror) {
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

    function getFileCode(fileName) {
      var fileExtension = fileName.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      var theCode = '';
      for (var i in languageList) {
        if (languageList.hasOwnProperty(i)) {
          angular.forEach(languageList[i].extensions, function (extensions) {
            if (extensions === fileExtension) {
              theCode = languageList[i].code;
            }
          });
        }
      }
      return theCode;
    }
    return factory;
  }

})();