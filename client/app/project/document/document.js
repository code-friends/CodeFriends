/*global angular:true, Hashes:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.document', ['ui.router'])
  .controller('documentController', function ($rootScope, $http, $scope, $stateParams, ToolbarFactory, documentFactory) {
    $scope.projectName = $stateParams.projectName;
    $scope.documentPath = $stateParams.documentPath;
    $scope.theme = ToolbarFactory.theme;
    $scope.language = '';
    $rootScope.$on('compile code', function () {
      var fileExtension = $scope.documentPath.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      var fileExtensionCode;
      for (var i in documentFactory.languageList) {
        if (documentFactory.hasOwnProperty(i)) {
          angular.forEach(documentFactory.languageList[i].extensions, function (extensions) {
            if (extensions === fileExtension) {
              fileExtensionCode = documentFactory.languageList[i].code;
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
        output.forEach(function (o) {
          console.log('Python Output:', o);
        });
      }).
      error(function (data, status, headers, config) {
        console.log(data);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    });


    $scope.theme = ToolbarFactory.theme;
    // Setup Code Editor
    $scope.cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
      mode: $scope.cm.findModeByName($scope.documentPath),
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized dark'
    });

    // listens for theme variable changed in ToolbarDocument factory broadcasted by $rootScope
    documentFactory.goToDocument($scope.projectName, $scope.documentPath, $scope.cm);
    $scope.$on('theme:changed', function (event, theme) {
      $scope.cm.setOption('theme', theme);
    });

  })
  .factory('documentFactory', function ($state, $stateParams) {
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
      },
      getFileLanguage: function (fileName, languageList) {
        var fileExtension = fileName.split('.');
        fileExtension = fileExtension[fileExtension.length - 1];
        console.log('WE GOT HERE FELLAS');
        var language = '';
        for (var i in languageList) {
          if (languageList.hasOwnProperty(i)) {
            angular.forEach(languageList[i].extensions, function (extensions) {
              if (extensions === fileExtension) {
                language = i;
              }
            });
          }
        }
        language = language.toString().toLowerCase();
        console.log(language);
        return language;
      }
    };
  });