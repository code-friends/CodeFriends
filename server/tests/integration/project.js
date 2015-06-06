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
var should = require('should');

describe('Project', function () {

  before(function (done) {
    return new ProjectCollection()
      .create({
        'projectName': 'car'
      })
      .then(function (_project) {
        global.project = _project;
        return login();
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'projectName': 'motorcycle'
          });
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'projectName': 'plane'
          });
      })
      .then(function () {
        return new ProjectCollection()
          .create({
            'projectName': 'basketball'
          });
      })
      .nodeify(done);
  });

  it('should create a new project on POST /project', function (done) {
    agent
      .post('/api/project')
      .send({
        projectName: 'tennis'
      })
      .expect(201)
      .then(function (res) {
        var _project = res.body;
        return agent
          .get('/api/project/' + _project.projectName)
          .expect(200)
          .then(function (res) {
            var project = res.body;
            project.should.have.property('id');
            project.should.have.property('projectName');
            project.projectName.should.equal(_project.projectName);
            project.should.have.property('createdAt');
            project.should.have.property('updatedAt');
            project.should.have.property('user');
            project.user.should.be.instanceof(Array);
          });
      })
      .nodeify(done);
  });

  describe('Uploading .zips in POST /api/project', function () {
    it('should add all files in the main folder from a .zip with a parent directory', function (done) {
      agent
        .post('/api/project')
        .send({
          projectName: 'zipProjectExample'
        })
        .field('projectName', 'zipProjectExample')
        /**
         * This .zip contains the following files
         * zipExampleProject
         * - example.md
         * - exampleFolder/superExample.js
         * - exampleFolder/subExampleFolder/subSuperExampleFolder.js
         */
        .attach('projectFile', './server/tests/test-files/zipExampleProject.zip')
        .expect(201)
        .then(function () {
          return agent
            .get('/api/project/' + 'zipProjectExample')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          //console.log('files');
          //console.log(files);
          files.should.have.property('examplemd');
          files.should.have.property('exampleFolder');
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
          return agent
            .get('/api/file/download/projectName/' + 'zipProjectExample' + '/fileName/exampleFolder/superExample.js')
            .expect(200);
        })
        .then(function (res) {
          var fileContents = res.text;
          var filePath = path.resolve(__dirname, '../test-files/zipExampleProject/exampleFolder/superExample.js');
          var exampleMdFileContents = fs.readFileSync(filePath);
          fileContents.should.equal(exampleMdFileContents.toString());
        })
        .nodeify(done);
    });

    it('should add all files in the main folder when uploading from .zip with no parent directory', function (done) {
      agent
        .post('/api/project')
        .send({
          projectName: 'zipFileExample'
        })
        .field('projectName', 'zipFileExample')
        /**
         * This .zip contains the following files
         * example.md
         * superExample.js
         */
        .attach('projectFile', './server/tests/test-files/fileExample.zip')
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
        })
        .nodeify(done);
    });
  });

  describe('Cloning git repos through POST /api/project', function () {
    // Increase timeout to 10s
    var _timeout = this._timeout;
    this.timeout(25000);

    it('should add all files into a project when a git url (https) is passed to it', function (done) {
      agent
        .post('/api/project')
        .send({
          projectName: 'gitCloneExample',
          gitRepoUrl: 'https://github.com/thejsj/twittler.git'
        })
        .then(function () {
          return agent
            .get('/api/project/' + 'gitCloneExample')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          files.should.have.property('indexhtml');
          files.should.have.property('data_generatorjs');
          files.src.files.js.files.should.have.property('appjs');
          files.src.files.js.files.appjs.should.be.an.instanceOf(Object);
          files.indexhtml.should.be.an.instanceOf(Object);
          files.indexhtml.name.should.equal('index.html');
          files.indexhtml.type.should.equal('file');
          files.src.files.js.files.appjs.name.should.equal('app.js');
          files.src.files.js.files.appjs.type.should.equal('file');
        })
        .nodeify(done);
    });

    xit('should add all files into a project when a git (git) url is passed to it', function (done) {
      agent
        .post('/api/project')
        .send({
          projectName: 'gitCloneExampleRecurssion',
          gitRepoUrl: 'git@github.com:thejsj/recursion.git'
        })
        .then(function () {
          return agent
            .get('/api/project/' + 'gitCloneExampleRecurssion')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          files.should.have.property('READMEmd');
          files.should.have.property('SpecRunnerhtml');
          files.src.files.should.have.property('stringifyJSONjs');
          files.src.files.should.be.an.instanceOf(Object);
          files.SpecRunnerhtml.should.be.an.instanceOf(Object);
          files.SpecRunnerhtml.name.should.equal('SpecRunner.html');
          files.SpecRunnerhtml.type.should.equal('file');
          files.src.files.stringifyJSONjs.name.should.equal('stringifyJSON.js');
          files.src.files.stringifyJSONjs.type.should.equal('file');
        })
        .nodeify(done);
    });

    // This causes our function to break, since it's too large and too many Mongo connection are mde
    // createNewFileOrFolder needs to be re-factored so that updateFileStructure is only called one
    xit('should add all files into a project when a larger git repo url is passed to it', function (done) {
      agent
        .post('/api/project')
        .send({
          projectName: 'gitCloneExampleCodeFriends',
          gitRepoUrl: 'https://github.com/code-friends/CodeFriends.git'
        })
        .then(function () {
          return agent
            .get('/api/project/' + 'gitCloneExampleCodeFriends')
            .expect(200);
        })
        .then(function (res) {
          var files = res.body.files;
          files.should.have.property('Dockerfile');
          files.should.have.property('bowerjson');
          // files.src.files.should.have.property('stringifyJSONjs');
          // files.src.files.should.be.an.instanceOf(Object);
          // files.SpecRunnerhtml.should.be.an.instanceOf(Object);
          // files.SpecRunnerhtml.name.should.equal('SpecRunner.html');
          // files.SpecRunnerhtml.type.should.equal('file');
          // files.src.files.stringifyJSONjs.name.should.equal('stringifyJSON.js');
          // files.src.files.stringifyJSONjs.type.should.equal('file');
        })
        .nodeify(done);
    });

    this.timeout(_timeout);
  });

  it('should add a user to a project on PUT /project/addUser', function (done) {
    agent
      .put('/api/project/addUser')
      .send({
        newUserName: 'Chase',
        projectName: 'basketball'
      })
      .expect(200)
      .then(function (res) {
        var project = res.body;
        project.should.be.instanceof(Object);
        project.should.have.property('id');
        project.should.have.property('projectName');
        project.should.have.property('createdAt');
        project.should.have.property('updatedAt');
        project.should.have.property('user');
        project.user.should.be.instanceof(Array);
        project.user.length.should.equal(1);
      })
      .nodeify(done);
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
            projects[0].should.have.property('projectName');
            projects[0].should.have.property('createdAt');
            projects[0].should.have.property('updatedAt');
            projects[0].should.have.property('user');
          });
      })
      .nodeify(done);
  });

  //SHOULD THIS BE AN OBJECT OR IS THERE A SITUATION WHERE THERE COULD BE MORE THAN ONE????
  it('should get a specific project on GET /project/:projectName', function (done) {
    agent
      .get('/api/project/' + global.project.get('projectName'))
      .expect(200)
      .then(function (res) {
        var projectResponse = res.body;
        projectResponse.should.be.instanceof(Object);
        projectResponse.should.have.property('id');
        projectResponse.should.have.property('projectName');
        projectResponse.projectName.should.equal(global.project.get('projectName'));
        projectResponse.should.have.property('createdAt');
        projectResponse.should.have.property('updatedAt');
        projectResponse.should.have.property('user');
        projectResponse.should.have.property('files');
        projectResponse.user.should.be.instanceof(Array);
      })
      .nodeify(done);
  });

  it('should get a specific project on GET /project/:id', function (done) {
    agent
      .get('/api/project/' + global.project.get('id'))
      .expect(200)
      .then(function (res) {
        var projectResponse = res.body;
        projectResponse.should.be.instanceof(Object);
        projectResponse.should.have.property('id');
        projectResponse.should.have.property('projectName');
        projectResponse.projectName.should.equal(global.project.get('projectName'));
        projectResponse.should.have.property('createdAt');
        projectResponse.should.have.property('updatedAt');
        projectResponse.should.have.property('user');
        projectResponse.user.should.be.instanceof(Array);
      })
      .nodeify(done);
  });

  it('should delete a project on DELETE /project/projectId', function (done) {
    agent
      .delete('/api/project/')
      .send({
        id: global.project.get('id')
      })
      .then(function () {
        return agent
          .get('/api/project')
          .expect(200)
          .then(function (res) {
            var projects = res.body;
            var projectWithID1 = projects.filter(function (proj) {
              if (proj.id === 1) {
                return true;
              }
              return false;
            });
            projectWithID1.length.should.equal(0);
          });
      })
      .nodeify(done);
  });
});
