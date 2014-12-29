var express = require('express');
var models = require('../models.js').models;
var collections = require('../models.js').collections;
var Promise = require('bluebird');

var projectController = {};

//ADDS A NEW PROJECT AND ADDS THE CREATOR TO THE 'USER' PROPERTY
projectController.post = function (req, res) {
  // var userId = req.user.get('id');
  // ABOVE IS THE RIGHT ONE ONCE AUTH IS ATTACHED. DUMMY DATA BELOW
  var userId = {
    id: 2
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
      return model.related('user').create(userId).yield(model);
    })
    .then(function (model) {
      res.json(model.toJSON());
    })
};

projectController.getAllProjects = function (req, res) {
  // var userId = req.user.get('id');
  //only allow access to the file for projects associated with this current user (they only have permission for those)

  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.send(coll.toJSON());
    });
};

projectController.getSpecificProjectByName = function (req, res) {
  // var userId = req.user.get('id');
  //if user is one of the users in if the project
  //////then execute the code below

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
      res.send(coll);
    });
};

projectController.getSpecificProjectById = function (req, res) {
  // var userId = req.user.get('id');

  //if user is one of the users in if the project
  //////then execute the code below

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
      res.send(coll);
    });
};

////ADD USER TO A PROJECT
projectController.addUser = function (req, res) {
  // var userId = req.user.get('id');
  var newUser = req.params.newUser;
  var userId = {
      id: newUser
    }
    // console.log('REQ IN THE ADDUSER!!!!!!!!!!!!!!!!!!', req)

  models.Project
    .query({
      where: {
        project_name: 'basketball'
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (model) {
      return model.related('user').create(userId).yield(model);
    })
    .then(function (model) {
      console.log('MODEL !!!!!!!!', model)
      res.json(model.toJSON());
    })
};

////REMOVE USERS FROM A PROJECT
projectController.put = function (req, res) {
  // var userId = req.user.get('id');
  res.status(200).end();
};

//DELETE A PROJECT
projectController.delete = function (req, res) {
  // var userId = req.user.get('id');

  //if user is one of the users in if the project
  //////then execute the code below
  res.status(200).end();
};

module.exports = projectController;