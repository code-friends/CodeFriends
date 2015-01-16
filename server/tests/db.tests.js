/*global describe:true, it:true */
'use strict';

var Promise = require('bluebird');
var UserCollection = require('../models.js').collections.UserCollection;
var ProjectCollection = require('../models.js').collections.ProjectCollection;
var TemplateCollection = require('../models.js').collections.TemplateCollection;
var expect = require('chai').expect;
var should = require('should');
var _ = require('lodash');

describe('Database', function () {

  //tests adding a new user and creating a collection
  describe('User', function () {
    it('should create a new user', function (done) {
      new UserCollection()
        .create({
          'username': 'door'
        })
        .then(function () {
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
          'projectName': 'car'
        })
        .then(function () {
          return ProjectCollection
            .query('where', 'project_name', '=', 'car')
            .fetch();
        })
        .then(function (coll) {
          var _projectName = _.last(coll.toJSON()).projectName;
          expect(_projectName).to.equal('car');
          done();
        })
        .catch(function (err) {
          console.log(err);
          expect(false).to.equal(true);
          done();
        });
    });
  });

  //tests adding a new template and creating a collection
  describe('Template', function () {
    it('should create a new template', function (done) {
      new TemplateCollection()
        .create({
          'template_name': 'crazyTestTemplate'
        })
        .then(function () {
          return TemplateCollection
            .query('where', 'template_name', '=', 'crazyTestTemplate')
            .fetch();
        })
        .then(function (coll) {
          var _templateName = _.last(coll.toJSON()).templateName;
          expect(_templateName).to.equal('crazyTestTemplate');
          done();
        })
        .catch(function (err) {
          console.log(err);
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
          expect(_user.toJSON().project[0].projectName).to.equal('car');
          done();
        })
        .catch(function () {
          expect(false).to.equal(true);
        });
    });
  });

});