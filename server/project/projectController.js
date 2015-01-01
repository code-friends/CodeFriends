'use strict';

var models = require('../models.js').models;
var Promise = require('bluebird');
var db = require('../db');

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
  console.log('getAllProjects');
  var userId = req.user.get('id');

  // .query({
  //   where: {
  //     user: req.user
  //   }
  // })

  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      res.json(coll.toJSON());
    });
};
// .catch(function (err) {
//   console.log('Error Querying Projects:', err);
// });
// var allTheUsersProjectsById = [];
// var userProjects = models.User
//   .query({
//     where: {
//       id: userId
//     }
//   })
//   .fetch({
//     withRelated: ['project']
//   })
//   .then(function (model) {
//     if (!model) {
//       console.log('DUDE, THERE IS NO MODEL WITH THAT NAME !!!!!!!!');
//     }
// var door = model.get('project').at(0).get('id');
// console.log('DOOR !!!!', door);
// var allTheUsersProjects = model.relations.project.models;
// for (var key in allTheUsersProjects) {
//   var projectId = allTheUsersProjects[key].attributes.id;
//   allTheUsersProjectsById.push(projectId);
// };

// console.log('all the project ids !!!!', allTheUsersProjectsById);
// console.log('model !!!!', model.relations.project.models[0].attributes.id);
// console.log('model !!!!', model);

// })
// .catch(function (err) {
//   console.log('Error adding user', err);
// });

// console.log('USERID !!!!!', userId);
// console.log('USERID !!!!!', req.user.id);


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
    })
    .catch(function (err) {
      console.log('Could Not Get getSpecificProject', err);
    });
};

/////////////////////////////////////////    PUT    /////////////////////////////////////////
//ADD USER TO A PROJECT   ///   var userId = req.user.get('id');   ///   BELOW IS HARD CODED. NEED TO CHANGE
projectController.addUser = function (req, res) {
  var project_name = req.body.project_name;
  var newUserName = req.body.newUserName;
  var newUserId = null;

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
      console.log('THE NEW USER', user);
      if (!user) throw new Error('There is not model with this name');
      return user;
    })
    .then(function (user) {
      newUserId = user.get('id');
    })
    .then(function () {
      console.log('NEWUSERID', newUserId);
    })
    .catch(function (err) {
      console.log('Error getting newUserId', err);
    });


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
        .create({
          id: newUserId
        })
        .yield(model)
        .catch(function (err) {
          console.log('Error adding user', err);
        });
    })
    .then(function (model) {
      res.json(model.toJSON());
    })
    .catch(function (err) {
      console.log('Error adding user', err);
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