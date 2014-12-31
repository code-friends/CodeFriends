'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  gulp.src([
      './client/lib/normalize.css/*.css',
      './client/assets/scss/*.scss'
    ])
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./client/dist/'));
});

//concats js, uglifying commented out currently
gulp.task('js', function () {
  gulp.src([
      './client/lib/underscore/underscore-min.js',
      './client/lib/angular/angular.js',
      './client/lib/angular-ui-router/release/angular-ui-router.js',
      './client/lib/bcrypt/bcrypt.js',
      './client/assets/js/share.js',
      './client/assets/js/codemirror.js',
      './client/assets/js/share-codemirror.js',
      './client/assets/js/mode-javascript.js',
      './client/app/services/services.js',
      './client/app/home/projects/projects.js',
      './client/app/landing/landing.js',
      './client/app/home/home.js',
      './client/app/userBox.js',
      './client/app/login/login.js',
      './client/app/project/project.js',
      './client/app/project/document/document.js',
      './client/app/project/chat/chat.js',
      './client/app/project/toolbar/toolbar.js',
      './client/app/app.js',
      './client/lib/ngSocket/dist/ngSocket.js'
    ])
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./client/dist/'));
});

gulp.task('watch', ['js', 'sass'], function () {
  gulp.watch('./client/assets/scss/*.scss', ['sass']);
  gulp.watch('./client/**/*.js', ['js']);
});

gulp.task('default', ['js', 'sass']);