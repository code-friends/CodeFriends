angular.module("code.editor", ['ui.router'])

.controller("editorController", function ($scope, $state ) {
  $scope.goToHome = function () {
    $state.go('home');

  };
  $scope.runThis = function(){
  	CodeMirror.fromTextArea( document.getElementById('pad'), {
  	  value: "function myScript(){return 100;}\n",
  	  mode:  "javascript", 
  	  lineNumbers: true
  	}); 
  	//cm.setMode('javascript')
  	var elem = document.getElementById('pad');
  }
  $scope.runThis(); 

});