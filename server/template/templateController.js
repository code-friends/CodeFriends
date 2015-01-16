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

	getAllTemplates: function (req, res) {
		models.Template
			.fetchAll()
			.then(function (coll) {
				console.log('coll: ', coll);
				// return coll.toJSON().filter(function (model) {
				// 	return _.some(model.user, function (user) {
				// 		return user.id === req.user.get('id');
				// });
				// });
			})
			.then(function (templatesArray) {
				console.log('templatesArray: ', templatesArray);
				res.json(templatesArray);
			})
			.catch(function (err) {
				console.log('Error fetching projects : ', err);
			});

	},

	createNewTemplate: function (req, res) {
		//write conditional to make sure the name doesn't exist cause if they're global we can't have 
		//two of the same name
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
						templateName: templateName,
						gitRepoUrl: gitRepoUrl,
						userId: userId
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
		//figure out how to search by id instead of template name
		// var id = req.body.id;
		var newTemplateName = req.body.newTemplateName;
		var oldTemplateName = req.body.oldTemplateName;
		var requestingUserId = req.user.id;

		return new Q()
			.then(function () {
				return models.Template
					.query({
						where: {
							template_name: oldTemplateName
						}
					})
					.fetch()
					.then(function (template) {
						return template;
					})
					.catch(function (err) {
						console.log('No Model Could Be Found: ', err);
					});
			})
			.then(function (template) {
				if (template.get('userId') !== requestingUserId) {
					throw new Error('Wait a second. You are not the creator of this template!');
				}
				return template
					.save({
						templateName: newTemplateName
					})
					.then(function (template) {
						res.status(200).json(template.toJSON());
					})
					.catch(function (err) {
						res.status(400).end();
					});
			});

	},

	updateGitRepoUrl: function (req, res) {
		//figure out how to search by id instead of template name
		// var id = req.body.id;
		var newGitRepoUrl = req.body.newGitRepoUrl;
		var oldGitRepoUrl = req.body.oldGitRepoUrl;
		var requestingUserId = req.user.id;

		return new Q()
			.then(function () {
				return models.Template
					.query({
						where: {
							git_repo_url: oldGitRepoUrl
						}
					})
					.fetch()
					.then(function (template) {
						return template;
					})
					.catch(function (err) {
						console.log('No Model Could Be Found: ', err);
					});
			})
			.then(function (template) {
				if (template.get('userId') !== requestingUserId) {
					throw new Error('Wait a second. You are not the creator of this template!');
				}
				return template
					.save({
						gitRepoUrl: newGitRepoUrl
					})
					.then(function (template) {
						res.status(200).json(template.toJSON());
					})
					.catch(function (err) {
						res.status(400).end();
					});
			});

	},

	deleteTemplate: function (req, res) {

	}

};

module.exports = templateController;