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
        user.timeStamps();
      })
      .then(function (table) {
        console.log('created table: users');
      });
  }
});

//projects schema
db.schema.hasTable('projects').then(function (exists) {
  if (!exists) {
    db.schema.createTable('projects', function (project) {
        project.increments('id').primary();
        project.string('projectname', 255);
        project.timeStamps();
      })
      .then(function (table) {
        console.log('created table: projects');
      });
  }
});

var bookshelf = require('bookshelf')(db);
module.exports = bookshelf