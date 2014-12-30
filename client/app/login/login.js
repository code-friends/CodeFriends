/*global angular:true */
angular.module('code.login', ['ui.router'])
	.controller('loginController', function ($scope, $state, AuthFactory) {
		console.log('Showing Login.js');
		AuthFactory.isLoggedIn();
		// Silence is Beautiful
	});