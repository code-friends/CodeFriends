/*global angular:true */
angular.module('code.login', ['ui.router'])
	.controller('loginController', function ($scope, $state, Auth) {
		console.log('Showing Login.js');
		Auth.isLoggedIn();
		// Silence is Beautiful
	});