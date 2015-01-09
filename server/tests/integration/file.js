/*global describe:true, it:true, before: true */
'use strict';

var Promise = require('bluebird');
var request = require('supertest-as-promised');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);
var fs = Promise.promisifyAll(require('fs'));

describe('File', function () {

  // agent persists cookies and sessions

  var project_name = 'basketball';
  before(function (done) {
    login()
      .then(function () {
        done();
      });
  });

  it('should get the file structure for a project', function (done) {
    agent
      .get('/api/file/')
      .send({
        project_name: project_name,
      })
      .expect(200)
      .then(function (res) {
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
        type: 'file',
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
        var fileKey = 'main.js'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[fileKey]).to.be.a('object');
        expect(fileStructure.files[fileKey].name).to.equal('main.js');
        done();
      });
  });

  it('should throw a 400 error when a file has already been created', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'main.js',
        type: 'file',
      })
      .expect(400)
      .then(function () {
        done();
      });
  });

  it('should add a new folder when POSTed', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'example',
        type: 'folder',
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
        var fileKey = 'example'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[fileKey]).to.be.a('object');
        expect(fileStructure.files[fileKey].name).to.equal('example');
        done();
      });
  });

  it('should add a new file to a folder that was already added', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'index.js',
        type: 'file',
        path: '/example'
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
        var folderKey = 'example'.replace('.', '');
        var fileKey = 'index.js'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[folderKey]).to.be.a('object');
        expect(fileStructure.files[folderKey].name).to.equal('example');
        expect(fileStructure.files[folderKey].files[fileKey].name).to.equal('index.js');
        done();
      });
  });

  it('should add a new folder to a folder that was already added', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'child',
        type: 'folder',
        path: '/example'
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
        var folderKey = 'example'.replace('.', '');
        var fileKey = 'child'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[folderKey]).to.be.a('object');
        expect(fileStructure.files[folderKey].name).to.equal('example');
        expect(fileStructure.files[folderKey].files[fileKey].name).to.equal('child');
        expect(fileStructure.files[folderKey].files[fileKey].type).to.equal('folder');
        done();
      });
  });

  it('should add a new file to a second-level folder', function (done) {
    agent
      .post('/api/file')
      .send({
        project_name: project_name,
        file_name: 'jorge.js',
        type: 'file',
        path: '/example/child'
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
        // console.log('find the path in the fileStructure for jorge.js: fileStructure', fileStructure.files.example.files.child);
        var folderKey = 'example'.replace('.', '');
        var folderKey2 = 'child'.replace('.', '');
        var fileKey = 'jorge.js'.replace('.', '');
        expect(fileStructure.files).to.be.a('object');
        expect(fileStructure.files[folderKey]).to.be.a('object');
        expect(fileStructure.files[folderKey].name).to.equal('example');
        expect(fileStructure.files[folderKey].files[folderKey2].name).to.equal('child');
        expect(fileStructure.files[folderKey].files[folderKey2].type).to.equal('folder');
        expect(fileStructure.files[folderKey].files[folderKey2].files[fileKey].name).to.equal('jorge.js');
        expect(fileStructure.files[folderKey].files[folderKey2].files[fileKey].type).to.equal('file');
        done();
      });
  });

  it('should get the file structure when requesting a project through GET', function (done) {
    agent
      .get('/api/project/' + project_name)
      .expect(200)
      .then(function (res) {
        var project = res.body;
        var fileKey = 'main.js'.replace('.', '');
        project.should.have.property('id');
        project.should.have.property('files');
        project.files.should.be.instanceof(Object);
        project.files[fileKey].name.should.equal('main.js');
        done();
      });
  });

  //it is grabbing content
  //traversing the dom to grab the right object
  //it's deleting the object
  //traversing the dom to insert
  it('should upload a new file to the database', function (done) {
    agent
      .post('/api/file/upload')
      .field('file_name', 'dummyForTest2.js')
      .field('project_name', project_name)
      .field('path', '')
      .field('projectIdOrName', project_name)
      .field('type', 'file')
      .attach('testFile', './server/tests/test-files/dummyForTest.js')
      .expect(201)
      .then(function (res) {
        expect(res.body.files.dummyForTest2js).to.be.an('object');
        expect(res.body.files.dummyForTest2js.name).to.equal('dummyForTest2.js');
        done();
      });
  });

  it('should upload a new file to a folder in the database', function (done) {
    agent
      .post('/api/file/upload')
      .field('file_name', 'dummyForTest4.js')
      .field('project_name', project_name)
      .field('projectIdOrName', project_name)
      .field('path', '/example/')
      .field('type', 'file')
      .attach('testFile', './server/tests/test-files/dummyForTest.js')
      .expect(201)
      .then(function (res) {
        expect(res.body.files.example.files.dummyForTest4js).to.be.an('object');
        expect(res.body.files.example.files.dummyForTest4js.name).to.equal('dummyForTest4.js');
        done();
      });
  });

  it('should download a file in the database', function (done) {
    // '/api/file/download/projectName/' + $state.params.projectName + '/fileName';
    agent
      .get('/api/file/download/projectName/' + project_name + '/fileName/dummyForTest2.js')
      .expect(200)
      .expect('Content-disposition', 'attachment; filename=dummyForTest2.js')
      .then(function (res) {
        var fileContents = fs.readFileSync('./server/tests/test-files/dummyForTest.js');
        expect(res.text).to.equal(fileContents.toString());
        done();
      });
  });

  /**
   * This should probably be in project.js, but it's easier to test multiple files
   * here, since we're adding so many of them here
   */
  it('should download a project on GET /api/project/download/:project_name_or_id', function (done) {
    agent
      .get('/api/project/download/' + project_name)
      .expect(200)
      .expect('content-type', 'application/zip')
      .expect('Content-disposition', 'attachment; filename=' + project_name + '.zip')
      .then(function (res) {
        /**
         * This test it not very good
         * It basically compares the response string to the fileContents and file names
         * What it should do is save the contents as a zip, open this .zip, and then
         * compare the contents. I had problems turning this string into a .zip though.
         * It is well tested in the front-end. I'll updated this test when I find a good
         * way to do it. Sincerely Yours, Jorge.
         */
        var zipString = res.text;
        var fileContents = fs.readFileSync('./server/tests/test-files/dummyForTest.js');
        expect(zipString.substring(fileContents)).to.not.equal(-1);
        expect(zipString.substring('dummyForTest2.js')).to.not.equal(-1);
        expect(zipString.substring('main.js')).to.not.equal(-1);
        done();
      });
  });

  it('should move a file on PUT /api/file/move', function (done) {
    agent
      .put('/api/file/move')
      .send({
        projectName: project_name,
        fileName: 'dummyForTest4.js',
        type: 'file',
        path: 'example/dummyForTest.4js',
        newPath: '/dummyForTest4j.s',
        projectIdOrName: project_name,
      })
      .expect(201)
      .then(function (res) {
        // expect(zipString.substring(fileContents)).to.not.equal(-1);
        // expect(zipString.substring('dummyForTest2.js')).to.not.equal(-1);
        // expect(zipString.substring('main.js')).to.not.equal(-1);
        done();
      });
  });

});