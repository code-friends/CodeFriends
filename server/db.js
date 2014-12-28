var Promise = require('bluebird');

//MySQL
var knex = require('knex');
var connection;


// Use A Different Database For Testing
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
  connection = {
    host: process.env.DB_PORT_3306_TCP_ADDR,
    user: process.env.DB_ENV_MYSQL_USER,
    password: process.env.DB_ENV_MYSQL_PASS,
    database: 'code_friends',
  };
} else if (process.env.NODE_ENV === 'test') {
  connection = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: '',
    database: 'code_friends_test',
  };
} else {
  connection = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: '',
    database: 'code_friends',
  };
}

//creates database
var db = knex({
  client: 'mysql',
  connection: connection
});

conssole.log('CONNECTION:', connection);

//users schema
db.createAllTables = db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    return db.schema.createTable('users', function (user) {
        user.increments('id').primary();
        user.string('username', 255);
        user.string('githubId', 255);
        user.string('githubName', 255);
        user.string('githubEmail', 255);
        user.string('githubLocation', 255);
        user.string('githubAccessToken', 255);
        user.string('githubAvatarUrl', 255);
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
  //DO WE NEED THIS?? MODELS SHOULD TAKE CARE OF IT
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
          console.log('created table: user_projects');
        })
        .catch(function (error) {
          console.log('error creating user_projects: ', error);
        });
    }
  });
}).catch(function (err) {
  console.log('Error Creating Tables: ', err);
});

module.exports = db;