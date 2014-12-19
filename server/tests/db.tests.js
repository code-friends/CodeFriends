/*global describe:true, it:true */
var models = require('../models.js').models;
var collections = require('../models.js').collections;
var should = require('should');
var expect = require('chai').expect;
var _ = require('lodash');
var Promise = require('bluebird');

//tests adding a new user and creating a collection
describe('User', function () {
  it('should create a new user', function (done) {
    var coll = new collections.UserCollection();
    coll
      .create({
        'username': 'door'
      })
      .then(function (model) {
        return collections.UserCollection
          .query('where', 'username', '=', 'door')
          .fetch();
      })
      .then(function (coll) {
        var _username = _.last(coll.toJSON()).username;
        expect(_username).to.equal('door');
        done();
      })
      .catch(function () {
        throw new Error('User not created correctly');
      });
  });
});

//tests adding a new project and creating a collection
describe('Project', function () {
  it('should create a new project', function (done) {
    var coll = new collections.ProjectCollection();
    coll
      .create({
        'project_name': 'car'
      })
      .then(function (model) {
        return collections.ProjectCollection
          .query('where', 'project_name', '=', 'car')
          .fetch();
      })
      .then(function (coll) {
        var _projectName = _.last(coll.toJSON()).project_name;
        expect(_projectName).to.equal('car');
        done();
      })
      .catch(function () {
        expect(false).to.equal(true);
        done();
      });
  });
});

//create model for user with tied project
//tests adding a new project and creating a collection
describe('User/Project', function () {
  it('should attach user to a project', function (done) {
    var project, user;
    var projects = new collections.ProjectCollection();
    var users = new collections.UserCollection();
    projects
      .query('where', 'project_name', '=', 'car')
      .fetchOne()
      .then(function (_project) {
        project = _project;
        return users.query('where', 'username', '=', 'door').fetchOne();
      })
      .then(function (_user) {
        user = _user;
        return Promise.all([
          project.related('user').attach(user),
          user.related('project').attach(project)
        ]);
      })
      .then(function () {
        return users.query('where', 'username', '=', 'door').fetchOne({
          withRelated: ['project']
        });
      })
      .then(function (_user) {
        expect(_user.toJSON().project[0].project_name).to.equal('car');
        done();
      })
      .catch(function () {
        expect(false).to.equal(true);
      });
  });
});


//create model for project with tied user
//query database