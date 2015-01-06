/*global describe:true, xdescribe:true, it:true */
'use strict';

var request = require('supertest-as-promised');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);


describe('Upload', function () {

	before(function (done) {
		login()
			.then(function () {
				done();
			});
	});

	it('should add a new file to the database', function (done) {
		agent
			.post('/api/upload')
			.field('file_name', 'dummyForTest.js')
			.field('project_name', 'basketball')
			.field('path', '')
			.attach('testFile', './server/tests/integration/dummyForTest.js')
			.then(function (res) {
				expect(res.status).to.equal(200); // 'success' status
				done();
			});
	});

});