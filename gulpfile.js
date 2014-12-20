var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpConcat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('sass', function () {
  gulp.src('./client/assets/scss/*.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./client/dist/'));
});

//concats js, uglifying commented out currently
gulp.task('js', function () {
  gulp.src([
      './client/lib/underscore/underscore-min.js',
      './client/lib/angular/angular.js',
      './client/lib/angular-ui-router/release/angular-ui-router.js',
      './client/assets/js/share.js',
      './client/assets/js/codemirror.js',
      './client/assets/js/share-codemirror.js',
      './client/assets/js/mode-javascript.js',
      './client/assets/js/mode-javascript.js',
      './client/app/services/services.js',
      './client/app/home/projects/projects.js',
      './client/app/login/login.js',
      './client/app/projectEditor/editor/editor.js',
      './client/app/projectEditor/editor/editor.js',
      './client/app/app.js'
    ])
    .pipe(gulpConcat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./client/dist/'));
});


gulp.task('watch', ['js', 'sass'], function () {
  gulp.watch('./client/assets/scss/*.scss', ['sass']);
  gulp.watch('./client/**/*.js', ['js']);
});