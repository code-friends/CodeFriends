/*jshint node:true */
'use strict';

module.exports = function (agent) {
  return function () {
    return agent
      .post('/auth/signup')
      .send({
        email: 'brady@brady.com',
        password: 'basketball'
      })
      .then(function () {
        return agent
          .post('/auth/login')
          .send({
            email: 'brady@brady.com',
            password: 'basketball'
          });
      })
      .then(function () {
        return agent
          .post('/auth/signup')
          .send({
            email: 'brees@brees.com',
            password: 'soccer'
          });
      })
      .then(function () {
        return agent
          .post('/auth/login')
          .send({
            email: 'brees@brees.com',
            password: 'soccer'
          });
      })
      .then(function () {
        return agent
          .post('/auth/login')
          .send({
            email: 'rodgers@rodgers.com',
            password: 'rugby'
          });
      })
      .then(function () {
        return agent
          .get('/auth/user');
      })
      .catch(function (err) {
        console.log('Error Logging user in:', err);
      });
  };
};