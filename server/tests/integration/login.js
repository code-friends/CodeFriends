/*jshint node:true */
'use strict';

module.exports = function (agent){
  return function (done) {
    agent
      .post('/auth/signup')
      .send({
        email: 'jorge.silva@thejsj.com',
        password: 'basketball'
      })
      .end(function () {
        agent
          .post('/auth/login')
          .send({
            email: 'jorge.silva@thejsj.com',
            password: 'basketball'
          })
          .end(function () {
            agent
              .get('/auth/user')
              .end(function () {
                done();
              });
          });
      });
  };
};