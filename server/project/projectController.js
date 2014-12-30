var express = require('express');
var models = require('../models.js').models;
var collections = require('../models.js').collections;
var Promise = require('bluebird');
var db = require('../db');

var projectController = {};

/////////////////////////////////////////    POST    /////////////////////////////////////////
//ADDS A NEW PROJECT AND ADDS THE CREATOR TO THE 'USER' PROPERTY   ///   var userId = req.user.get('id');   ///   ABOVE IS THE RIGHT ONE ONCE AUTH IS ATTACHED. DUMMY DATA BELOW
projectController.post = function (req, res) {
  var userId = {
    id: 1
  };

  var project_name = req.body.project_name;

  if (!project_name) {
    res.status(400).end();
  }

  var newProject = new models.Project({
      project_name: project_name
    })
    .save()
    .then(function (model) {
      return model
        .related('user')
        .create(userId)
        .yield(model)
        .catch(function (err) {
          console.log('Error Attaching User:', err);
        })
    })
    .then(function (model) {
      res.json(model.toJSON());
    })
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
projectController.getSpecificProjectByName = function (req, res) {
  models.Project
    .query({
      where: {
        project_name: req.params.project_name
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.json(coll.toJSON());
    });
};

///   var userId = req.user.get('id');   ///   if user is one of the users in if the project   ///   then execute the code below
projectController.getSpecificProjectById = function (req, res) {
  models.Project
    .query({
      where: {
        id: req.params.id
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.json(coll.toJSON());
    });
};

/////////////////////////////////////////    PUT    /////////////////////////////////////////
//ADD USER TO A PROJECT   ///   var userId = req.user.get('id');   ///   BELOW IS HARD CODED. NEED TO CHANGE
projectController.addUser = function (req, res) {
  var project_name = req.body.project_name;
  var user = {
    id: req.body.userId
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
    })
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
    .then(function (model) {
      res.status(200).end();
    });

};

module.exports = projectController;