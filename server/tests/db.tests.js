/*global describe:true, it:true, before: true, after: true */
var models = require('../models.js').models;
var UserCollection = require('../models.js').collections.UserCollection;
var ProjectCollection = require('../models.js').collections.ProjectCollection;
var should = require('should');
var expect = require('chai').expect;
var _ = require('lodash');
var Promise = require('bluebird');
var db = require('../db');

before(function (done) {
  // createAllTables is promise
  db.createAllTables.then(function () {
    done();
  });
});

//tests adding a new user and creating a collection
describe('User', function () {
  it('should create a new user', function (done) {
    new UserCollection()
      .create({
        'username': 'door'
      })
      .then(function (model) {
        return UserCollection
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
    new ProjectCollection()
      .create({
        'project_name': 'car'
      })
      .then(function (model) {
        return ProjectCollection
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
    new ProjectCollection()
      .query('where', 'project_name', '=', 'car')
      .fetchOne()
      .then(function (_project) {
        project = _project;
        return new UserCollection().query('where', 'username', '=', 'door').fetchOne();
      })
      .then(function (_user) {
        user = _user;
        return Promise.all([
          project.related('user').attach(user),
          user.related('project').attach(project)
        ]);
      })
      .then(function () {
        return UserCollection.query('where', 'username', '=', 'door').fetchOne({
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

// Delete All Test Tables
after(function (done) {
  db.schema.dropTable('projects_users')
    .then(function () {
      return Promise.all([
        db.schema.dropTable('users'),
        db.schema.dropTable('projects'),
      ]);
    })
    .then(function () {
      console.log('Deleting All Tables');
      done();
    })
    .catch(function (err) {
      console.log('Didn\'t delete talbes:', err);
    });
});