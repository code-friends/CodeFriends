/*jshint node:true */
'use strict';
var config = require('config');
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var models = require('../models.js').models;


var templateController = {

	createNewTemplate: function (req, res) {
		var templateName = req.body.templateName;
		var gitRepoUrl = req.body.gitRepoUrl;
		var userId = req.user.id;
		console.log('templateName: ', templateName);
		console.log('gitRepoUrl: ', gitRepoUrl);
		console.log('userId: ', userId);

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
					.then(function (model) {
						console.log('model: ', model);
						console.log('req.user: ', req.user);
						return model
							.related('user')
							.create(req.user)
							.yield(model);
					})
					.catch(function (err) {
						console.log('Error creating new template in database');
					});
			})
			.then(function (model) {
				res.status(201).json(model.toJSON());
			})
			.catch(function (err) {
				console.log('Error Creating Template:', err);
				res.status(400).end();
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