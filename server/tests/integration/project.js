/*global describe:true, it:true, before: true */
'use strict';

var Promise = require('bluebird');
var request = require('supertest-as-promised');
var ProjectCollection = require('../../models').collections.ProjectCollection;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

describe('Project', function () {

  before(function (done) {
    return new ProjectCollection()
      .create({
        'project_name': 'car'
      })
      .then(function (_project) {
        global.project = _project;
        return login();
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'project_name': 'motorcycle'
          });
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'project_name': 'plane'
          });
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'project_name': 'basketball'
          });
      })
      .then(function () {
        done();
      });
  });

  it('should create a new project on POST /project', function (done) {
    agent
      .post('/api/project')
      .send({
        project_name: 'tennis'
      })
      .expect(201)
      .end(function (err, res) {
        var _project = res.body;
        agent
          .get('/api/project/' + _project.project_name)
          .expect(200)
          .end(function (err, res) {
            var project = res.body;
            project.should.have.property('id');
            project.should.have.property('project_name');
            project.project_name.should.equal(_project.project_name);
            project.should.have.property('created_at');
            project.should.have.property('updated_at');
            project.should.have.property('user');
            project.user.should.be.instanceof(Array);
            done();
          });
      });
  });

  describe('Uploading .zips in POST /api/project', function () {
    it('should add all files in the main folder', function (done) {
      agent
        .post('/api/project')
        .send({
          project_name: 'zipProjectExample'
        })
        .field('project_name', 'zipProjectExample')
        /**
         * This .zip contains the following files
         * zipExampleProject
         * - example.md
         * - exampleFolder/superExample.js
         * - exampleFolder/subExampleFolder/subSuperExampleFolder.js
         */
        .attach('project_file', './server/tests/test-files/zipExampleProject.zip')
        .expect(201)
        .then(function () {
          return agent
            .get('/api/project/' + 'zipProjectExample')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          // example.md
          files.examplemd.should.be.an.instanceOf(Object);
          files.examplemd.name.should.equal('example.md');
          files.examplemd.type.should.equal('file');
          // exampleFolder
          files.exampleFolder.name.should.equal('exampleFolder');
          files.exampleFolder.type.should.equal('folder');
          files.exampleFolder.files.should.be.an.instanceOf(Object);
          // exampleFolder/superExample.js
          files.exampleFolder.files.superExamplejs.should.be.an.instanceOf(Object);
          files.exampleFolder.files.superExamplejs.name.should.equal('superExample.js');
          files.exampleFolder.files.superExamplejs.type.should.equal('file');
          return true;
        })
        .then(function () {
          return agent
            .get('/api/file/download/projectName/' + 'zipProjectExample' + '/fileName/example.md')
            .expect(200);
        })
        .then(function (res) {
          var fileContents = res.text;
          var filePath = path.resolve(__dirname, '../test-files/zipExampleProject/example.md');
          var exampleMdFileContents = fs.readFileSync(filePath);
          fileContents.should.equal(exampleMdFileContents.toString());
          // Load File In Sub Directory
          // return agent
          //   .get('/api/file/download/projectName/' + 'zipProjectExample' + '/fileName/exampleFolder/superExample.js')
          //   .expect(200);
          done();
        });
      // .then(function (res) {
      //   var fileContents = res.text;
      //   var filePath = path.resolve(__dirname, '../test-files/zipExampleProject/exampleFolder/superExample.js');
      //   var exampleMdFileContents = fs.readFileSync(filePath);
      //   fileContents.should.equal(exampleMdFileContents.toString());
      //   done();
      // });
    });

    it('should add all files in the main folder', function (done) {
      agent
        .post('/api/project')
        .send({
          project_name: 'zipFileExample'
        })
        .field('project_name', 'zipFileExample')
        /**
         * This .zip contains the following files
         * example.md
         * superExample.js
         */
        .attach('project_file', './server/tests/test-files/fileExample.zip')
        .expect(201)
        .then(function () {
          return agent
            .get('/api/project/' + 'zipFileExample')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          files.should.have.property('superExamplejs');
          files.should.have.property('examplemd');
          files.superExamplejs.should.be.an.instanceOf(Object);
          files.examplemd.should.be.an.instanceOf(Object);
          files.superExamplejs.name.should.equal('superExample.js');
          files.superExamplejs.type.should.equal('file');
          files.examplemd.name.should.equal('example.md');
          files.examplemd.type.should.equal('file');
          return agent
            .get('/api/file/download/projectName/' + 'zipFileExample' + '/fileName/superExample.js')
            .expect(200);
        })
        .then(function (res) {
          var fileContent = res.text;
          var filePath = path.resolve(__dirname, '../test-files/zipExampleProject/superExample.js');
          var superExampleJSfileContents = fs.readFileSync(filePath);
          fileContent.should.equal(superExampleJSfileContents.toString());
          done();
        });
    });
  });

  it('should add a user to a project on PUT /project/addUser', function (done) {
    agent
      .put('/api/project/addUser')
      .send({
        newUserName: 'Chase',
        project_name: 'basketball'
      })
      .expect(200)
      .end(function (err, res) {
        var project = res.body;
        project.should.be.instanceof(Object);
        project.should.have.property('id');
        project.should.have.property('project_name');
        project.should.have.property('created_at');
        project.should.have.property('updated_at');
        project.should.have.property('user');
        project.user.should.be.instanceof(Array);
        project.user.length.should.equal(1);
        done();
      });
  });

  it('should get all of the user\'s projects on GET /project', function (done) {
    agent
      .get('/auth/user')
      .then(function (res) {
        return res.body.userId;
      })
      .then(function (userId) {
        return agent
          .get('/api/project')
          .expect(200)
          .then(function (res) {
            var projects = res.body;
            var containUser = _.all(projects, function (project) {
              return _.any(project.user, function (user) {
                return user.id === userId;
              });
            });
            containUser.should.equal(true);
            containUser.should.equal(true);
            projects.should.be.instanceof(Array);
            projects[0].should.have.property('id');
            projects[0].should.have.property('project_name');
            projects[0].should.have.property('created_at');
            projects[0].should.have.property('updated_at');
            projects[0].should.have.property('user');
            done();
          });
      });
  });

  //SHOULD THIS BE AN OBJECT OR IS THERE A SITUATION WHERE THERE COULD BE MORE THAN ONE????
  it('should get a specific project on GET /project/:project_name', function (done) {
    agent
      .get('/api/project/' + global.project.get('project_name'))
      .expect(200)
      .end(function (err, res) {
        var projectResponse = res.body;
        projectResponse.should.be.instanceof(Object);
        projectResponse.should.have.property('id');
        projectResponse.should.have.property('project_name');
        projectResponse.project_name.should.equal(global.project.get('project_name'));
        projectResponse.should.have.property('created_at');
        projectResponse.should.have.property('updated_at');
        projectResponse.should.have.property('user');
        projectResponse.should.have.property('files');
        projectResponse.user.should.be.instanceof(Array);
        done();
      });
  });
  it('should get a specific project on GET /project/:id', function (done) {
    agent
      .get('/api/project/' + global.project.get('id'))
      .expect(200)
      .end(function (err, res) {
        var projectResponse = res.body;
        projectResponse.should.be.instanceof(Object);
        projectResponse.should.have.property('id');
        projectResponse.should.have.property('project_name');
        projectResponse.project_name.should.equal(global.project.get('project_name'));
        projectResponse.should.have.property('created_at');
        projectResponse.should.have.property('updated_at');
        projectResponse.should.have.property('user');
        projectResponse.user.should.be.instanceof(Array);
        done();
      });
  });

  it('should delete a project on DELETE /project/projectId', function (done) {
    agent
      .delete('/api/project/')
      .send({
        id: global.project.get('id')
      })
      .end(function () {
        agent
          .get('/api/project')
          .expect(200)
          .end(function (err, res) {
            var projects = res.body;
            var project_with_id_1 = projects.filter(function (proj) {
              if (proj.id === 1) {
                return true;
              }
              return false;
            });
            project_with_id_1.length.should.equal(0);
            done();
          });
      });
  });
});