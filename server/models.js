var db = require('./db.js');
var bookshelf = require('bookshelf')(db);
var moment = require('moment');

//define models
var models = {};

models.User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  project: function () {
    return this.belongsToMany(models.Project);
  }
});

models.Project = bookshelf.Model.extend({
  tableName: 'projects',
  hasTimestamps: true,
  user: function () {
    return this.belongsToMany(models.User);
  }
});

//define collections
var collections = {};

collections.UserCollection = bookshelf.Collection.extend({
  model: models.User
});
collections.ProjectCollection = bookshelf.Collection.extend({
  model: models.Project
});

exports.models = models;
exports.collections = collections;