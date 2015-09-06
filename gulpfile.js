var src = 'src/';
var dest = 'build/';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');
var todo = require('gulp-todo');
var uglify = require('gulp-uglify');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var connect = require('gulp-connect');

gulp.task('clean', function() {
  return gulp.src(dest)
    .pipe(clean());
});

gulp.task('todo', function() {
  return gulp.src(src + 'js/*.js')
    .pipe(todo())
    .pipe(gulp.dest(src));
});

gulp.task('lint', function() {
  return gulp.src(src + 'js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(src + 'js/*.js')
    .pipe(stripDebug())
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/js'));
});

gulp.task('less', ['clean'], function() {
  return gulp.src(src + '/less/*.less')
    .pipe(less())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest + '/css'));
});

gulp.task('watch', function() {
  gulp.watch(src + '/js/*.js', ['todo', 'lint', 'scripts']);
  gulp.watch(src + '/less/*.less', ['less']);
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: dest
  });
});

gulp.task('default', ['clean', 'todo', 'lint', 'scripts', 'less', 'watch', 'webserver']);
