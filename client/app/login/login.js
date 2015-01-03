/*global angular:true */
angular.module('code.login', ['ui.router'])
	.controller('loginController', function ($scope, $state, Auth) {
		Auth.isLoggedIn();
		// Silence is Beautiful
	});