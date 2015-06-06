/*global describe:true, it:true, before: true */
'use strict';

var Promise = require('bluebird');
var request = require('supertest-as-promised');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);
var fs = Promise.promisifyAll(require('fs'));

describe('Template', function () {

	// agent persists cookies and sessions

	var templateName = 'superCrazyTemplate';
	var gitRepoUrl = 'https://github.com/thejsj/twittler.git';
	before(function (done) {
		login()
			.then(function () {
				done();
			});
	});

	it('should add a new template on POST api/template', function (done) {
		agent
			.post('/api/template/')
			.send({
				templateName: templateName,
				gitRepoUrl: gitRepoUrl
			})
			.expect(200)
			.then(function (res) {
				var template = res.body;
				expect(template).to.be.a('object');
				expect(template.templateName).to.equal(templateName);
				expect(template.gitRepoUrl).to.equal(gitRepoUrl);
				done();
			})
			.catch(done);
	});

	it('should add a update a template name on PUT api/template/newName', function (done) {
		agent
			.put('/api/template/newName')
			.send({
				oldTemplateName: templateName,
				newTemplateName: 'evenCrazierTemplate'
			})
			.expect(200)
			.then(function (res) {
				var template = res.body;
				expect(template).to.be.a('object');
				expect(template.templateName).to.equal('evenCrazierTemplate');
				expect(template.gitRepoUrl).to.equal(gitRepoUrl);
				done();
			})
			.catch(done);
	});

	it('should update a gitRepoUrl on PUT api/template/newGitRepoUrl', function (done) {
		agent
			.put('/api/template/newGitRepoUrl')
			.send({
				oldGitRepoUrl: gitRepoUrl,
				newGitRepoUrl: 'https://github.com/thejsj/SwipeRight.git'
			})
			.expect(200)
			.then(function (res) {
				var template = res.body;
				expect(template).to.be.a('object');
				expect(template.templateName).to.equal('evenCrazierTemplate');
				expect(template.gitRepoUrl).to.equal('https://github.com/thejsj/SwipeRight.git');
				done();
			})
			.catch(done);
	});

	it('should get all templates on GET api/template/', function (done) {
		agent
			.get('/api/template/')
			.expect(200)
			.then(function (res) {
				var allTemplates = res.body;
				expect(allTemplates).to.be.a('array');
				expect(allTemplates.length).to.equal(2);
				expect(allTemplates[1]).to.be.a('object');
				expect(allTemplates[1].templateName).to.equal('evenCrazierTemplate');
				expect(allTemplates[1].gitRepoUrl).to.equal('https://github.com/thejsj/SwipeRight.git');
				done();
			})
			.catch(done);
	});

	it('should delete a template on DELETE api/template/', function (done) {
		agent
			.delete('/api/template/')
			.send({
				templateName: 'evenCrazierTemplate'
			})
			.expect(200)
			.then(function (res) {
				agent
					.get('/api/template/')
					.expect(200)
					.then(function (res) {
						var allTemplates = res.body;
						expect(allTemplates).to.be.a('array');
						expect(allTemplates.length).to.equal(1);
						expect(allTemplates[0]).to.be.a('object');
						expect(allTemplates[0].templateName).to.equal('crazyTestTemplate');
						expect(allTemplates[0].gitRepoUrl).to.equal('https://github.com/chaseme3/frozenbiome.git');
						done();
					});
			})
			.catch(done);
	});

});
