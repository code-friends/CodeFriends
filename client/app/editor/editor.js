angular.module("code.editor", ['ui.router'])

.controller("editorController", function ($scope, $state ) {
  $scope.goToHome = function () {
    $state.go('home');

  };
  $scope.runThis = function(){

  	var cm = CodeMirror.fromTextArea( document.getElementById('pad'), {
  		mode: 'javascript', 
  		value: "alert('hello world')",
  		lineNumbers: true
  	} ); 

  	var elem = document.getElementById('pad');
  	var ws = new WebSocket('ws://localhost:8007');

  	var sjs = new window.sharejs.Connection( ws );
  	
  	var doc = sjs.get( 'users', 'seph' );
  	// console.log(doc);
  	doc.subscribe();

  	doc.whenReady(function () {
  	  if (!doc.type) doc.create('text');
  	  if (doc.type && doc.type.name === 'text')
  	  doc.attachCodeMirror(cm);
  	});
  }
  $scope.runThis(); 

});