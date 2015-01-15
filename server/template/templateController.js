/*jshint node:true */
'use strict';
var config = require('config');
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var models = require('../models.js').models;
var Promise = require('bluebird');
var db = require('../db');


var templateController = {

	createNewTemplate: function (req, res) {
		var templateName = req.body.templateName;
		var gitRepoUrl = req.body.gitRepoUrl;
		var userId = req.user.id;
		var templateToAttachToUser;

		return new Q()
			.then(function () {
				if (!templateName) throw new Error('No Template Name Passed');
			})
			.then(function () {
				return new models.Template({
						template_name: templateName,
						git_repo_url: gitRepoUrl,
						user_id: userId
					})
					.save()
					.then(function (template) {
						res.status(200).json(template.toJSON());
					})
					.catch(function (err) {
						console.log('Error creating template: ', err);
						res.status(400).end();
					});
			});
	},

	updateTemplateName: function (req, res) {

	},

	updateTemplateUrl: function (req, res) {

	},

	deleteTemplate: function (req, res) {

	}

};

module.exports = templateController;