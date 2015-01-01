/*global describe:true, it:true, before: true */
'use strict';

var request = require('supertest-as-promised');
var UserCollection = require('../../models').collections.UserCollection;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);

describe('User', function () {

  before(function (done) {
    return new UserCollection()
      .create({
        'username': 'Catherine'
      })
      .then(function (_user) {
        global.user = _user;
        return login();
      })
      .then(function () {
        return new UserCollection()
          .create({
            'username': 'Doug'
          });
      })
      .then(function () {
        return new UserCollection()
          .create({
            'username': 'Jorge'
          });
      })
      .then(function () {
        return new UserCollection()
          .create({
            'username': 'Chase'
          });
      })
      .then(function () {
        done();
      });
  });

  it('should get all of the users and their projects on GET /user', function (done) {
    agent
      .get('/api/user')
      .expect(200)
      .end(function (err, res) {
        // console.log('RES.BODY IN USER TESTS !!!', res.body);
        var users = res.body;
        // console.log('users');
        // console.log(users);
        users.should.be.instanceof(Array);
        users[0].should.have.property('id');
        users[0].should.have.property('username');
        users[0].should.have.property('githubId');
        users[0].should.have.property('githubName');
        users[0].should.have.property('githubEmail');
        users[0].should.have.property('githubLocation');
        users[0].should.have.property('githubAccessToken');
        users[0].should.have.property('githubAvatarUrl');
        users[0].should.have.property('created_at');
        users[0].should.have.property('updated_at');
        users[0].should.have.property('project');
        done();
      });
  });

  it('should get a specific user on GET /user/:username', function (done) {
    agent
      .get('/api/user/' + global.user.get('username'))
      .expect(200)
      .end(function (err, res) {
        var user = res.body;
        user.should.be.instanceof(Object);
        user.should.have.property('id');
        user.should.have.property('username');
        user.should.have.property('githubId');
        user.should.have.property('githubName');
        user.should.have.property('githubEmail');
        user.should.have.property('githubLocation');
        user.should.have.property('githubAccessToken');
        user.should.have.property('githubAvatarUrl');
        user.should.have.property('created_at');
        user.should.have.property('updated_at');
        user.should.have.property('project');
        user.project.should.be.instanceof(Array);
        done();
      });
  });

  it('should create a new user on POST /user', function (done) {
    agent
      .post('/api/user')
      .send({
        username: 'chaseme3',
        githubId: 'thisIsMyGithubId',
        githubName: 'thisIsMyGithubName',
        githubEmail: 'thisIsMyGithubEmail',
        githubLocation: 'thisIsMyGithubLocation',
        githubAccessToken: 'thisIsMyGithubAccessToken',
        githubAvatarUrl: 'thisIsMyGithubAvatarUrl'
      })
      .expect(200)
      .end(function (err, res) {
        var _user = res.body;
        agent
          .get('/api/user/' + _user.username)
          .expect(200)
          .end(function (err, res) {
            var user = res.body;
            user.should.have.property('id');
            user.should.have.property('username');
            user.username.should.equal(_user.username);
            user.should.have.property('githubId');
            user.should.have.property('githubName');
            user.should.have.property('githubEmail');
            user.should.have.property('githubLocation');
            user.should.have.property('githubAccessToken');
            user.should.have.property('githubAvatarUrl');
            user.should.have.property('created_at');
            user.should.have.property('updated_at');
            user.should.have.property('project');
            user.project.should.be.instanceof(Array);
            done();
          });
      });
  });

});