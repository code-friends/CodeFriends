/*global describe:true, xdescribe:true, it:true */
'use strict';

var request = require('supertest-as-promised');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);


xdescribe('Upload', function () {

	it('should add a new file to the database', function () {
		agent
			.post('/api/upload')
			.send({
				data: {
					file_name: files[fileIndex].name,
					project_name: $stateParams.projectName,
					parent_file: null
				},
				file: files[fileIndex]
			})
			.end(function (err, res) {
				console.log('res in test: ', res);
				var newFileStructure = res.body;
				expect(fileStructure.files).to.be.a('object');
				done();
			});
	});

	it('should add multiple files to the database', function () {

	});

	it('', function () {

	});

});

describe('API', function () {
	require('./user');
	require('./project');
	require('./file');
});