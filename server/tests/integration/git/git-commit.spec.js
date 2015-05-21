/*global describe:true, it:true, before: true */
'use strict';

var Promise = require('bluebird');
var request = require('supertest-as-promised');
var expect = require('chai').expect;
var app = require('../../index');
var agent = request.agent(app);
var login = require('./login')(agent);
var fs = Promise.promisifyAll(require('fs'));

describe('gitCommit', function () {

// agent persists cookies and sessions

  var projectName = 'basketball';
  before(function (done) {
    login()
      .then(function () {
        done();
      });
  });

  it('should ', function (done) {
    
  });

  it('should ', function (done) {
    
  });

});

