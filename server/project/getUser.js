'use strict';

var models = require('../models.js').models;

var getUser = function (newUserName) {
  return models.User
    .query({
      where: {
        username: newUserName
      }
    })
    .fetch({
      withRelated: ['project']
    });
};

module.exports = getUser;