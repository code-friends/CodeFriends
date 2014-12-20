/*global describe:true, it:true */
var request = require('supertest');
var should = require('should');
var expect = require('chai').expect;
var app = require('../index');

var _ = require('lodash');

describe('Auth', function () {

  it('should sign up the user', function () {

  });

  it('should authenticate the user', function () {

  });

  it('should logout the user', function () {

  });

});

describe('API', function () {

  //this depends on database insertions from db.tests
  describe('Project', function () {

    it('should get all of the user\'s projects on GET /project', function (done) {
      request(app)
        .get('/api/project')
        .expect(200)
        .end(function (err, res) {
          // console.log('below is body');
          // console.log(res.body);
          var projects = res.body;
          console.log('projects', projects);
          projects.should.be.instanceof(Array);
          projects[0].should.have.property('id');
          projects[0].should.have.property('project_name');
          projects[0].should.have.property('created_at');
          projects[0].should.have.property('updated_at');
          projects[0].should.have.property('user');
          done();
        });
    });

    it('should get a specific project on GET /project/:id', function (done) {

    });

    it('should create a new project on POST /project', function () {

    });

  });

  describe('User', function () {

    it('should get all user info on GET /user/:github_handle', function () {

    });

  });

});