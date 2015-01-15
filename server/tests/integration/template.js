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
				console.log('res in template.js', res);
				// var fileStructure = res.body;
				// expect(fileStructure.files).to.be.a('object');
				done();
			})
			.catch(function (err) {
				throw new Error(err);
				done();
			});
	});

});