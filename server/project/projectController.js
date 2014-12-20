var express = require('express');
var models = require('../models.js').models;
var collections = require('../models.js').collections;


var projectController = {};

projectController.post = function (req, res) {
  res.status(200).end();
};


projectController.getAllProjects = function (req, res) {
  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.send(coll.toJSON());
    })
};

projectController.getSpecificProject = function (req, res) {
  // console.log('REQ PARAMS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.params.id);
  models.Project
    .query('where', 'id', '=', req.params.id)
    .fetch({
      withRelated: ['user']
    })
    .then(function (coll) {
      // console.log('RES !!!!!!!!!!!', res);
      // console.log('COLl !!!!!!!!!!!!!!!!!!!!!', coll);
      res.send(coll);
    })
};

projectController.put = function (req, res) {
  res.status(200).end();
};

// projectController.getProject = function (req, res) {
//   //dummy data
//   res.json({
//     indexhtml: 'htmlcodehtmlcode'
//   });
// };

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