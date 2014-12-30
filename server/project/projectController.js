'use strict';

var models = require('../models.js').models;
var Promise = require('bluebird');
var db = require('../db');

var getFileStructure = require('../file/fileController').getFileStructure;

var projectController = {};

/////////////////////////////////////////    POST    /////////////////////////////////////////
//ADDS A NEW PROJECT AND ADDS THE CREATOR TO THE 'USER' PROPERTY   
projectController.post = function (req, res) {

  console.log('THIS IS REQ IN PROJECT.CONTROLLER.POST !!!!', req);

  var userId = req.user.get('id');

  var project_name = req.body.project_name;

  if (!project_name) {
    res.status(400).end();
  }
  new models.Project({
      project_name: project_name,
    })
    .save()
    .then(function (model) {
      return model
        .related('user')
        .create(userId)
        .yield(model)
        .catch(function (err) {
          console.log('Error Attaching User:', err);
        });
    })
    .then(function (model) {
      res.json(model.toJSON());
    });
};

/////////////////////////////////////////    GET    /////////////////////////////////////////
///   var userId = req.user.get('id');   ///   only allow access to the file for projects associated with this current user (they only have permission for those)
projectController.getAllProjects = function (req, res) {
  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.json(coll.toJSON());
    });
};

///   var userId = req.user.get('id');   ///   if user is one of the users in if the project   ///   then execute the code below
projectController.getSpecificProject = function (req, res) {
  models.Project
    .query({
      where: {
        project_name: req.params.project_name_or_id
      },
      orWhere: {
        id: req.params.project_name_or_id
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (project) {
      return getFileStructure(project.get('id'))
        .then(function (fileStructure) {
          var project_json = project.toJSON();
          project_json.files = fileStructure.files;
          res.json(project_json);
        });
    });
};

/////////////////////////////////////////    PUT    /////////////////////////////////////////
//ADD USER TO A PROJECT   ///   var userId = req.user.get('id');   ///   BELOW IS HARD CODED. NEED TO CHANGE
projectController.addUser = function (req, res) {
  console.log('REQ !!!!!!!!!', req.body);
  var project_name = req.body.project_name;
  var newUserName = req.body.newUserName;
  var newUser = models.User
    .query({
      where: {
        username: newUserName
      }
    })
    .fetch({
      withRelated: ['project']
    })
    .then(function (model) {
      if (!model) {
        console.log('DUDE, THERE IS NO MODEL WITH THAT NAME !!!!!!!!');
      }
      console.log('ID !!!!', model.get('id'));
    })
    .catch(function (err) {
      console.log('Error adding user', err);
    });


  var user = {
    id: newUser
  };

  models.Project
    .query({
      where: {
        project_name: project_name
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (model) {
      return model
        .related('user')
        .create(user)
        .yield(model)
        .catch(function (err) {
          console.log('Error adding user', err);
        });
    })
    .then(function (model) {
      res.json(model.toJSON());
    });
};

//REMOVE USERS FROM A PROJECT   ///   if user is one of the users in if the project   ///   then execute the code below
projectController.put = function (req, res) {
  // var userId = req.user.get('id');
  res.status(200).end();
};

/////////////////////////////////////////    DELETE    /////////////////////////////////////////
//DELETE A PROJECT
projectController.delete = function (req, res) {
  models.Project
    .query({
      where: {
        id: req.body.id
      }
    })
    .fetch()
    .then(function (model) {
      return db('projects_users')
        .where('project_id', '=', model.get('id'))
        .del()
        .then(function () {
          return model;
        });
    })
    .then(function (model) {
      return model.destroy();
    })
    .then(function () {
      res.status(200).end();
    });
};

module.exports = projectController;