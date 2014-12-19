//mongoDB
// //folder architecture for a project
// var projectSchema = new mongoose.Schema({
//   projectName: String,
//   projectFileTree: String // obj_json_str
// });

//mongoDB
//insert the straight up mongo

//MySQL

var knex = require('knex');

//creates database
var db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: '',
    database: 'code_friends',
  }
});

//users schema
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
        user.increments('id').primary();
        user.string('username', 255);
        user.timestamps();
      })
      .then(function () {
        console.log('created table: users');
      })
      .catch(function (error) {
        console.log('error creating users: ', error);
      });
  }
});

//projects schema
db.schema.hasTable('projects').then(function (exists) {
  if (!exists) {
    db.schema.createTable('projects', function (project) {
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

//creates join table for users and projects
db.schema.hasTable('users_projects').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users_projects', function (userProjects) {
        userProjects.increments('id').primary();
        userProjects.integer('user_id').unsigned().references('id').inTable('users');
        userProjects.integer('project_id').unsigned().references('id').inTable('projects');
        userProjects.timestamps();
      })
      .then(function () {
        console.log('created table: user_projects');
      })
      .catch(function (error) {
        console.log('error creating user_projects: ', error);
      });
  }
});

var bookshelf = require('bookshelf')(db);
module.exports = bookshelf;


//to create database at beginning of project
//go to terminal
//mysql -u root
//create database 'name of database'