/*jshint node:true */
'use strict';
var config = require('config');
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var models = require('../models.js').models;
var Promise = require('bluebird');
var db = require('../db');
var isGitUrl = require('../file/isGitUrl');


var templateController = {

	getAllTemplates: function (req, res) {
		models.Template
			.fetchAll()
			.then(function (coll) {
				res.status(200).json(coll.toJSON());
			})
			.catch(function (err) {
				console.log('Error fetching all templates : ', err);
				res.status(400).end();

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
				if (!isGitUrl(gitRepoUrl)) throw new Error('Invalid Git URL');
			})
			.then(function () {
				models.Template
					.query('where', 'template_name', '=', templateName)
					.fetch()
					.then(function (template) {
						if (template) throw new Error('Template name already exists. Please choose another name.');
					})
					.catch(function (err) {
						console.log('Error checking if template name exists');
					});
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
				if (!isGitUrl(newGitRepoUrl)) throw new Error('Invalid Git URL');
			})
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
		//only delete the project if person requesting the deletion has a relation with it
		var templateName = req.body.templateName;
		var requestingUserId = req.user.id;

		return new Q()
			.then(function () {
				return models.Template
					.query({
						where: {
							template_name: templateName
						}
					})
					.fetch()
					.then(function (template) {
						// console.log('template: ', template);
						return template.destroy();
					})
					.then(function () {
						res.status(200).end();
					})
					.catch(function (err) {
						console.log('Error deleting template: ', err);
						res.status(400).end();
					});
			});

	}

};

module.exports = templateController;