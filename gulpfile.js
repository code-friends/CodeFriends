var gulp = require('gulp');
var sass = require('gulp-sass');


gulp.task('sass', function () {
  gulp.src('./client/assets/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'));
});

gulp.task('default', function () {
  // place code for your default task here
});

gulp.task('test', function () {

});