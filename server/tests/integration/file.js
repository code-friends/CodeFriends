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

  var projectName = 'basketball';
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
        projectName: projectName,
      })
      .expect(200)
      .then(function (res) {
        var fileStructure = res.body;
        expect(fileStructure.files).to.be.a('object');
        done();
      })
      .catch(done);
  });

  it('should add a new file when POSTed', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: '/main.js',
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
      })
      .catch(done);
  });

  it('should throw a 400 error when a file has already been created', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: 'main.js',
        type: 'file',
      })
      .expect(400)
      .then(function () {
        done();
      })
      .catch(done);
  });

  it('should add a new folder when POSTed', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: '/example',
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
      })
      .catch(done);
  });

  it('should add a new file to a folder that was already added', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: '/example/index.js',
        type: 'file',
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
      })
      .catch(done);
  });

  it('should add a new folder to a folder that was already added', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: '/example/child',
        type: 'folder',
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
      })
      .catch(done);
  });

  it('should add a new file to a second-level folder', function (done) {
    agent
      .post('/api/file')
      .send({
        projectName: projectName,
        filePath: '/example/child/jorge.js',
        type: 'file',
      })
      .expect(201)
      .then(function (res) {
        var fileStructure = res.body;
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
      })
      .catch(done);
  });

  it('should get the file structure when requesting a project through GET', function (done) {
    agent
      .get('/api/project/' + projectName)
      .expect(200)
      .then(function (res) {
        var project = res.body;
        var fileKey = 'main.js'.replace('.', '');
        project.should.have.property('id');
        project.should.have.property('files');
        project.files.should.be.instanceof(Object);
        project.files[fileKey].name.should.equal('main.js');
        done();
      })
      .catch(done);
  });

  //it is grabbing content
  //traversing the dom to grab the right object
  //it's deleting the object
  //traversing the dom to insert
  it('should upload a new file to the database', function (done) {
    agent
      .post('/api/file/upload/')
      .field('filePath', '/dummyForTest2.js')
      .field('projectName', projectName)
      .field('type', 'file')
      .attach('file', './server/tests/test-files/dummyForTest.js')
      .expect(201)
      .then(function (res) {
        return agent
          .get('/api/file/')
          .send({
            projectName: projectName,
          });
      })
      .then(function (res) {
        expect(res.body.files.dummyForTest2js).to.be.an('object');
        expect(res.body.files.dummyForTest2js.name).to.equal('dummyForTest2.js');
        done();
      })
      .catch(done);
  });

  it('should upload a new file to a folder in the database', function (done) {
    agent
      .post('/api/file/upload/')
      .field('projectName', projectName)
      .field('filePath', '/example/dummyForTest4.js')
      .field('type', 'file')
      .attach('file', './server/tests/test-files/dummyForTest.js')
      .expect(201)
      .then(function (res) {
        expect(res.body.files.example.files.dummyForTest4js).to.be.an('object');
        expect(res.body.files.example.files.dummyForTest4js.name).to.equal('dummyForTest4.js');
        done();
      })
      .catch(done);
  });

  // This has to do with paths and fileNames not working together correctly
  it('should download a file in the database', function (done) {
    // '/api/file/download/projectName/' + $state.params.projectName + '/fileName';
    agent
      .get('/api/file/download/projectName/' + projectName + '/fileName/dummyForTest2.js')
      .expect(200)
      .expect('Content-disposition', 'attachment; filename=dummyForTest2.js')
      .then(function (res) {
        var fileContents = fs.readFileSync('./server/tests/test-files/dummyForTest.js');
        expect(res.text).to.equal(fileContents.toString());
        done();
      })
      .catch(done);
  });


  // This has to do with paths and fileNames not working together correctly
  it('should download a file in the database that is not in the root folder', function (done) {
    agent
      .get('/api/file/download/projectName/' + projectName + '/fileName/example/dummyForTest4.js')
      .expect(200)
      .expect('Content-disposition', 'attachment; filename=dummyForTest4.js')
      .then(function (res) {
        var fileContents = fs.readFileSync('./server/tests/test-files/dummyForTest.js');
        expect(res.text).to.equal(fileContents.toString());
        done();
      })
      .catch(done);
  });

  /**
   * This should probably be in project.js, but it's easier to test multiple files
   * here, since we're adding so many of them here
   */
  it('should download a project on GET /api/project/download/:projectNameOrId', function (done) {
    agent
      .get('/api/project/download/' + projectName)
      .expect(200)
      .expect('content-type', 'application/zip')
      .expect('Content-disposition', 'attachment; filename=' + projectName + '.zip')
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
      })
      .catch(done);
  });

  describe('Moving Files', function () {

    it('should move a file from a folder to root on PUT /api/file/move', function (done) {
      agent
        .put('/api/file/move')
        .send({
          projectName: projectName,
          type: 'file',
          filePath: '/example/dummyForTest4.js',
          newPath: '/dummyForTest4.js',
          projectIdOrName: projectName
        })
        .expect(201)
        .then(function (res) {
          var fileStructure = res.body.files;
          var oldPathTemp = '/example/dummyForTest4.js';
          var newPathTemp = '/dummyForTest4.js';
          var oldPath = oldPathTemp.replace('.', '').split('/');
          var newPath = newPathTemp.replace('.', '').split('/');
          var objAtOldPath = fileStructure[oldPath[1]][oldPath[2]];
          var objAtNewPath = fileStructure[newPath[1]];
          expect(objAtOldPath).to.not.equal(true);
          expect(objAtNewPath.name).to.equal('dummyForTest4.js');
          expect(objAtNewPath.type).to.equal('file');
        })
        .then(function (res) {
          return agent
            .get('/api/file/download/projectName/' + projectName + '/fileName/dummyForTest4.js')
            .send({
              projectName: projectName,
            })
            .expect(200)
            .then(function (res) {
              var textAtNewPath = res.text;
              var textInOriginalFile = fs.readFileSync('./server/tests/test-files/dummyForTest.js').toString();
              expect(textAtNewPath).to.equal(textInOriginalFile);
            })
            .catch(function (err) {
              console.log('Error getting file for test: ', err);
              done();
            });
        })
        .then(function (res) {
          return agent
            .get('/api/file/download/projectName/' + projectName + '/fileName/example/dummyForTest4.js')
            .expect(200)
            .expect('Content-disposition', 'attachment; filename=dummyForTest4.js')
            .then(function (res) {
              expect(res.text).to.equal('');
              done();
            })
            .catch(function (err) {
              console.log('File content should have been deleted at old path but was not: ', err);
              done();
            });
        })
        .catch(done);
    });

    it('should move a file from root to a folder on PUT /api/file/move', function (done) {
      agent
        .put('/api/file/move')
        .send({
          projectName: projectName,
          type: 'file',
          filePath: '/dummyForTest2.js',
          newPath: '/example/dummyForTest2.js',
          projectIdOrName: projectName
        })
        .expect(201)
        .then(function (res) {
          var fileStructure = res.body.files;
          var oldPathTemp = '/dummyForTest2.js';
          var newPathTemp = '/example/dummyForTest2.js';
          var oldPath = oldPathTemp.replace('.', '').split('/');
          var newPath = newPathTemp.replace('.', '').split('/');
          var objAtOldPath = fileStructure[oldPath[1]];
          var index1 = newPath[1];
          var objAtNewPath = fileStructure[index1].files;
          expect(objAtOldPath).to.not.equal(true);
          expect(objAtNewPath[newPath[2]].name).to.equal('dummyForTest2.js');
          expect(objAtNewPath[newPath[2]].type).to.equal('file');
        })
        .then(function (res) {
          return agent
            .get('/api/file/download/projectName/' + projectName + '/fileName/example/dummyForTest2.js')
            .expect(200)
            .expect('Content-disposition', 'attachment; filename=dummyForTest2.js')
            .then(function (res) {
              var textAtNewPath = res.text;
              var textInOriginalFile = fs.readFileSync('./server/tests/test-files/dummyForTest.js').toString();
              expect(textAtNewPath).to.equal(textInOriginalFile);
            })
            .catch(function (err) {
              console.log('File content should have been deleted at old path but was not: ', err);
              done();
            });
        })
        .then(function (res) {
          return agent
            .get('/api/file/download/projectName/' + projectName + '/fileName/dummyForTest2.js')
            .send({
              projectName: projectName,
            })
            .expect(200)
            .then(function (res) {
              expect(res.text).to.equal('');
              done();
            })
            .catch(function (err) {
              console.log('Error getting file for test: ', err);
              done();
            });
        })
        .catch(done);
    });

    it('should move a file from root to a folder that is within a folder on PUT /api/file/move', function (done) {
      // this.timeout(15000);
      agent
        .put('/api/file/move')
        .send({
          projectName: projectName,
          type: 'file',
          filePath: '/main.js',
          newPath: '/example/child/main.js',
          projectIdOrName: projectName
        })
        .expect(201)
        .then(function (res) {
          var fileStructure = res.body.files;
          var oldPathTemp = '/main.js';
          var newPathTemp = '/example/child/main.js';
          var oldPath = oldPathTemp.replace('.', '').split('/');
          var newPath = newPathTemp.replace('.', '').split('/');
          var objAtOldPath = fileStructure[oldPath[1]];
          var nameOfFileInPath = newPath[3];
          var objAtNewPath = fileStructure.example.files.child.files[nameOfFileInPath];
          expect(objAtOldPath).to.not.equal(true);
          expect(objAtNewPath.name).to.equal('main.js');
          expect(objAtNewPath.type).to.equal('file');
        })
        .then(function (res) {
          return agent
            .get('/api/project/' + projectName)
            .expect(200)
            .then(function (res) {
              var fileStructure = res.body;
              var movedFile = fileStructure.files.example.files.child.files['mainjs'];
              expect(movedFile).to.be.an('object');
              expect(movedFile.name).to.equal('main.js');
              expect(movedFile.type).to.equal('file');
              expect(movedFile.path).to.equal('/example/child/main.js');
              done();
            })
            .catch(function (err) {
              console.log('File content should have been deleted at old path but was not: ', err);
              done();
            });
        })
        .catch(done);
    });

    it('should move a file from a folder that is within a folder to the root on PUT /api/file/move', function (done) {
      // this.timeout(15000);
      agent
        .put('/api/file/move')
        .send({
          projectName: projectName,
          type: 'file',
          filePath: '/example/child/main.js',
          newPath: '/main.js',
          projectIdOrName: projectName
        })
        .expect(201)
        .then(function (res) {
          var fileStructure = res.body.files;
          var oldPathTemp = '/example/child/main.js';
          var newPathTemp = '/main.js';
          var oldPath = oldPathTemp.replace('.', '').split('/');
          var newPath = newPathTemp.replace('.', '').split('/');
          var objAtOldPath = fileStructure[oldPath[2]];
          var nameOfFileInPath = newPath[1];
          var objAtNewPath = fileStructure[nameOfFileInPath];
          expect(objAtOldPath).to.not.equal(true);
          expect(objAtNewPath.name).to.equal('main.js');
          expect(objAtNewPath.type).to.equal('file');
          expect(objAtNewPath.path).to.equal('/main.js');
        })
        .then(function (res) {
          return agent
            .get('/api/project/' + projectName)
            .expect(200)
            .then(function (res) {
              var fileStructure = res.body;
              var movedFile = fileStructure.files['mainjs'];
              expect(movedFile).to.be.an('object');
              expect(movedFile.name).to.equal('main.js');
              expect(movedFile.type).to.equal('file');
              expect(movedFile.path).to.equal('/main.js');
              done();
            })
            .catch(function (err) {
              console.log('File content should have been deleted at old path but was not: ', err);
              done();
            });
        })
        .catch(done);
    });

  });

});
