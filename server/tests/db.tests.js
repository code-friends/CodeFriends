var models = require('../models.js').models;
var collections = require('../models.js').collections;
var should = require('should');
var expect = require('chai').expect;
var _ = require('lodash');




//tests adding a new user and creating a collection
describe('User', function(){
  it('should create a new user', function(done){
    var coll = new collections.UserCollection;
    coll
      .create({
        'username': 'door'
      })
      .then(function(model){
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
        done();
      });
  })
})
  
//tests adding a new project and creating a collection  
describe('Project', function(){
  it('should create a new project', function(done){
    var coll = new collections.ProjectCollection;
    coll
      .create({
        'project_name': 'car'
      })
      .then(function(model){
        return collections.ProjectCollection
          .query('where', 'project_name', '=', 'car')
          .fetch();
      })
      .then(function(coll){
        var _project_name = _.last(coll.toJSON()).project_name;
        expect(_project_name).to.equal('car');
        done();
      })
      .catch(function(){
        throw new Error('Project not created correctly');
        done();
      });
  })
})


//create model for user with tied project
  //query database

//create model for project with tied user
  //query database

