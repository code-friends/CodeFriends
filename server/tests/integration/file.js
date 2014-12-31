'use strict';
/*global describe:true, xdescribe:true, it:true, before: true */

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);

describe('File', function () {

  // agent persists cookies and sessions

  var project_name = 'basketball';
  before(login);

  it('should get the file structure for a project', function (done) {
    agent
      .get('/api/file/')
      .send({
        project_name: project_name,
      })
      .end(function (err, res) {
        var fileStructure = res.body;
        expect(fileStructure.files).to.be.a('object');
        done();
      });
  });

  it('should add a new file when POSTed', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'main.js',
      })
      .end(function (err, res) {
        var fileStructure = res.body;
        var fileKey = 'main.js'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[fileKey]).to.be.a('object');
        expect(fileStructure.files[fileKey].name).to.equal('main.js');
        done();
      });
  });

  it('should get the file structure when requesting a project through GET', function (done) {
    agent
      .get('/api/project/' + project_name)
      .expect(200)
      .end(function (err, res) {
        var project = res.body;
        var fileKey = 'main.js'.replace('.', '');
        project.should.have.property('id');
        project.should.have.property('files');
        project.files.should.be.instanceof(Object);
        project.files[fileKey].name.should.equal('main.js');
        done();
      });
  });

});