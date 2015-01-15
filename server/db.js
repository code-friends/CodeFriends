'use strict';
var Promise = require('bluebird');
var config = require('config');

//MySQL
var knex = require('knex');

//creates database
var db = knex({
  client: 'mysql',
  connection: config.get('mysql')
});

//users schema
db.createAllTables = db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    return db.schema.createTable('users', function (user) {
        user.increments('id').primary();
        user.string('username', 255);
        user.string('email', 255);
        user.string('password', 255);
        user.string('github_id', 255);
        user.string('github_name', 255);
        user.string('github_email', 255);
        user.string('github_location', 255);
        user.string('github_access_token', 255);
        user.string('github_avatar_url', 255);
        user.timestamps();
      })
      .then(function () {
        console.log('created table: users');
      })
      .catch(function (error) {
        console.log('error creating users: ', error);
      });
  }
}).then(function () {
  //projects schema
  return db.schema.hasTable('projects').then(function (exists) {
    if (!exists) {
      return db.schema.createTable('projects', function (project) {
          project.increments('id').primary();
          project.string('project_name', 255);
          project.timestamps();
        })
        .then(function () {
          console.log('created table: projects');
        })
        .catch(function (error) {
          console.log('error creating projects: ', error);
        });
    }
  });
}).then(function () {
  //templates schema
  return db.schema.hasTable('templates').then(function (exists) {
    if (!exists) {
      return db.schema.createTable('templates', function (template) {
          template.increments('id').primary();
          template.integer('user_id').unsigned().references('id').inTable('users');
          template.string('template_name', 255);
          template.string('git_repo_url', 255);
          template.timestamps();
        })
        .then(function () {
          console.log('created table: templates');
        })
        .catch(function (error) {
          console.log('error creating templates: ', error);
        });
    }
  });
}).then(function () {
  //creates join table for users and projects
  return db.schema.hasTable('projects_users').then(function (exists) {
    if (!exists) {
      return db.schema.createTable('projects_users', function (projectsUsers) {
          projectsUsers.increments('id').primary();
          projectsUsers.integer('user_id').unsigned().references('id').inTable('users');
          projectsUsers.integer('project_id').unsigned().references('id').inTable('projects');
          projectsUsers.timestamps();
        })
        .then(function () {
          console.log('created table: projects_users');
        })
        .catch(function (error) {
          console.log('error creating projects_users: ', error);
        });
    }
  });
}).catch(function (err) {
  console.log('Error Creating Tables: ', err);
});

module.exports = db;