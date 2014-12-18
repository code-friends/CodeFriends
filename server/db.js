//mongoDB
// //folder architecture for a project
// var projectSchema = new mongoose.Schema({
//   projectName: String,
//   projectFileTree: String // obj_json_str
// });

//mongoDB
  //insert the straight up mongo

//MySQL
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: 'admin',
    password: '',
    database: '',
  }
});

// Table: Users
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 255); // Not sure if we'll need this
      user.string('token', 255); // Not sure if we'll need this
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table `users`');
    }).catch(function (table) {
      console.log('Cannot Create Table `users`');      
    })
  }
});

// Table: Users
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 255); // Not sure if we'll need this
      user.string('token', 255); // Not sure if we'll need this
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table `users`');
    }).catch(function (table) {
      console.log('Cannot Create Table `users`');      
    })
  }
});


var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
  hasTimestamps: true
});

var Project = bookshelf.Model.extend({
  tableName: 'projects',
  hasTimestamps: true
});



