var db = require('./db.js');
var moment = require('moment');

//define models
var models = {};

models.User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  project: function () {
    return this.belongsToMany(models.Project);
  }
});

models.Project = db.Model.extend({
  tableName: 'projects',
  hasTimestamps: true,
  user: function () {
    return this.belongsToMany(models.User);
  }
});

//define collections
var collections = {};

collections.UserCollection = db.Collection.extend({
  model: models.User
});
collections.ProjectCollection = db.Collection.extend({
  model: models.Project
});

exports.models = models;
exports.collections = collections;