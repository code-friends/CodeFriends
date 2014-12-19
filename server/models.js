var db = require('./db.js');
var moment = require('moment');
var models = {};

//
models.User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  project: function(){
    return this.belongsToMany(models.Project).through(model.User_Projects);
  }
});

//
models.Project = db.Model.extend({
  tableName: 'projects',
  hasTimestamps: true,
  user: function(){
    return this.belongsToMany(models.User).through(models.User_Projects);
  }
});

//
models.Projects_Users = db.Model.extend({
  tableName: 'projects_users',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(models.User);
  },
  project: function(){
    return this.belongsTo(models.Project);
  }
});

module.exports = models;

