/*global angular:true, Hashes:true, CodeMirror:true, _:true */
/*jshint browser:true */
(function () {
  'use strict';
  angular.module('codeFriends.document', [])
    .controller('DocumentController', DocumentController);

  DocumentController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', 'ToolbarFactory', 'DocumentFactory'];


  function DocumentController($scope, $rootScope, $http, $stateParams, ToolbarFactory, DocumentFactory) {
    $scope.projectName = $stateParams.projectName;
    $scope.documentPath = $stateParams.documentPath;
    $scope.theme = ToolbarFactory.theme;
    $scope.language = '';
    $scope.theme = ToolbarFactory.theme;

    // Setup Code Editor
    $scope.cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    $rootScope.$on('compile code', function () {
      var fileExtension = $scope.documentPath.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      var fileExtensionCode;
      for (var i in DocumentFactory.languageList) {
        if (DocumentFactory.hasOwnProperty(i)) {
          angular.forEach(DocumentFactory.languageList[i].extensions, function (extensions) {
            if (extensions === fileExtension) {
              fileExtensionCode = DocumentFactory.languageList[i].code;
              $scope.language = i;
            }
          });
        }
      }
      var postObj = {
        'language': fileExtensionCode,
        'code': $scope.cm.getValue()
      };

      $http.post('https://compile.remoteinterview.io/compile/', postObj).
      success(function (data, status, headers, config) {
        var output = data.output.split(/\n/g);
        // This shoul only happend if the language is JavaScript
        output.forEach(function (eachConsoleLog) {
          console.log('Output:', eachConsoleLog);
        });
      }).
      error(function (data, status, headers, config) {
        console.log(data);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    });
    // Setup Code Editor
    var documentPathSplit = $scope.documentPath.split('.');
    var fileExtension = documentPathSplit[documentPathSplit.length - 1];
    $scope.cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: CodeMirror.findModeByName(fileExtension).mode,
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    // listens for theme variable changed in ToolbarDocument factory broadcasted by $rootScope
    DocumentFactory.goToDocument($scope.projectName, $scope.documentPath, $scope.cm);
    $scope.$on('theme:changed', function (event, theme) {
      $scope.cm.setOption('theme', theme);
    });

  }
}).factory('documentFactory', function (Projects, $state, $stateParams) {
  return {
    languageList: {
      "C#": {
        code: 10,
        extensions: ['cs']
      },
      "C++": {
        code: 7,
        extensions: ['cpp']
      },
      "Clojure": {
        code: 2,
        extensions: ['clj']
      },
      "Java": {
        code: 8,
        extensions: ['java']
      },
      "Go": {
        code: 6,
        extensions: ['cpp']
      },
      "JavaScript": {
        code: 4,
        extensions: ['js']
      },
      "PHP": {
        code: 3,
        extensions: ['php']
      },
      "Python": {
        code: 0,
        extensions: ['py']
      },
      "Ruby": {
        code: 1,
        extensions: ['rb']
      },
      "Scala": {
        code: 5,
        extensions: ['scala']
      },
      "VB.NET": {
        code: 9,
        extensions: ['vb']
      },
      "Shell": {
        code: 11,
        extensions: ['sh']
      },
      "Objective C": {
        code: 12,
        extensions: ['m']
      }
    },
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
  };
})();