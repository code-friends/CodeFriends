var express = require('express');
var models = require('../models.js').models;
var collections = require('../models.js').collections;


var projectController = {};

projectController.post = function (req, res) {

  // console.log('REQ !!!!!!!!!!!!!!!!!', req.body.project_name);
  // console.log('RES !!!!!!!!!!!!!!!!!', res);
  var project_name = req.body.project_name;

  if (!project_name) {
    res.status(400).end();
  }
  var newProject = new models.Project({
      project_name: project_name
    })
    .save()
    .then(function (model) {
      // console.log(json(model.toJSON()));
      res.json(model.toJSON());
    })
};

projectController.getAllProjects = function (req, res) {
  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.send(coll.toJSON());
    });
};

projectController.getSpecificProject = function (req, res) {
  models.Project
    .query('where', 'project_name', '=', req.params.project_name)
    .fetch({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.send(coll);
    });
};


projectController.put = function (req, res) {
  //add users
  //add files
  //remove users
  res.status(200).end();
};

projectController.delete = function (req, res) {
  res.status(200).end();
};

module.exports = projectController;