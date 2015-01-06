'use strict';

var models = require('../models.js').models;
var Promise = require('bluebird');
var db = require('../db');
var _ = require('lodash');

var getFileStructure = require('../file/fileController').getFileStructure;

var projectController = {};

/////////////////////////////////////////    POST    /////////////////////////////////////////
//ADDS A NEW PROJECT AND ADDS THE CREATOR TO THE 'USER' PROPERTY   
projectController.post = function (req, res) {

  var userId = {
    id: req.user.get('id')
  };

  var project_name = req.body.project_name;

  if (!project_name || !userId) {
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
projectController.getAllProjects = function (req, res) {
  var userId = req.user.get('id');
  //the below request is not optimized
  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      return coll.toJSON().filter(function (model) {
        return _.some(model.user, function (user) {
          return user.id === req.user.get('id');
        });
      });
    })
    .then(function (projectsArray) {
      res.json(projectsArray);
    })
    .catch(function (err) {
      console.log('Error fetching projects : ', err);
    });
};

projectController.getSpecificProject = function (req, res) {
  //only get the requested project if the user has a relation with it
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
    })
    .catch(function (err) {
      console.log('Could Not Get getSpecificProject', err);
    });
};

/////////////////////////////////////////    PUT    /////////////////////////////////////////
projectController.addUser = function (req, res) {
  var project_name = req.body.project_name;
  var newUserName = req.body.newUserName;
  var newUserId = null;
  //only only add the user if the person that requested the addition is a listed user of the project
  models.User
    .query({
      where: {
        username: newUserName
      }
    })
    .fetch({
      withRelated: ['project']
    })
    .then(function (user) {
      if (!user) throw new Error('There is not model with this name');
      //change so that if there is not user, it does a res.end saying 'there is no user', so they know that on the front end
      return user;
    })
    .then(function (queriedUser) {
      return models.Project
        .query({
          where: {
            project_name: project_name
          }
        })
        .fetch({
          withRelated: ['user']
        })
        .then(function (model) {
          // console.log('model', model);
          return model
            .related('user')
            .create({
              id: queriedUser.get('id')
            })
            .yield(model)
            .then(function (model) {
              res.json(model.toJSON());
            })
            .catch(function (err) {
              console.log('Error adding user', err);
            });
        });

    })
    .catch(function (err) {
      console.log('Error getting newUserId', err);
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
  //only delete the project if person requesting the deletion has a relation with it
  models.Project
    .query({
      where: {
        id: req.body.id
      }
    })
    .fetch()
    .then(function (model) {
      if (model === null) {
        throw new Error('No model found for that id');
      }
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
    })
    .catch(function (err) {
      res.status(400).end();
    })
};

module.exports = projectController;