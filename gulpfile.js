'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  gulp.src([
      './client/assets/scss/main.scss'
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
      './client/lib/underscore/underscore.js',
      './client/lib/angular/angular.js',
      './client/lib/angular-bootstrap/ui-bootstrap.js',
      './client/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      './client/lib/angular-ui-router/release/angular-ui-router.js',
      './client/lib/angular-scroll-glue/src/scrollglue.js',
      './client/lib/jshashes/hashes.js',
      './node_modules/simplewebrtc/simplewebrtc.bundle.js',
      './node_modules/share/webclient/share.js',
      './client/lib/codemirror/lib/codemirror.js',
      './node_modules/share-codemirror/share-codemirror.js',
      './client/lib/codemirror/mode/javascript/javascript.js',
      './client/app/services/services.js',
      './client/app/services/projectListFactory.js',
      './client/app/home/projects/projects.js',
      './client/app/home/home.js',
      './client/app/userBox.js',
      './client/app/project/project.js',
      './client/app/project/document/document.js',
      './client/app/project/chat/chat.js',
      './client/app/project/chat/video/video.js',
      './client/app/project/toolbar/toolbar.js',
      './client/app/templates/mainHeaderDirective.js',
      './client/app/templates/modalCreateProject.js',
      './client/app/templates/modalAddToProject.js',
      './client/app/project/uploads/uploads.js',
      './client/app/app.js',
      './client/lib/ngSocket/dist/ngSocket.js',
      './client/lib/moment/moment.js',
      './client/lib/angular-sanitize/angular-sanitize.js',
      './client/lib/ng-file-upload/angular-file-upload.js'
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