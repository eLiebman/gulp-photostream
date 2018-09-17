"use strict";
//Required Modules
const gulp = require('gulp'),
      maps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
      sass = require('gulp-sass'),
      csso = require('gulp-csso'),
     image = require('gulp-image'),
       del = require('del'),
    useref = require('gulp-useref'),
       run = require('run-sequence');

//Concatenate and Minify all JavaScript files, keeping a sourcemap
//Rename all.min.js, save to dist/scripts
gulp.task('scripts', () => {
  return gulp.src(['js/circle/autogrow.js','js/circle/circle.js','js/global.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(connect.reload());
});

//Compile and Minify all .sass and .scss files, keeping a sourcemap
//Rename all.min.css, save to dist/styles
gulp.task('styles', () => {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
});

//Optimize images, save to dist/content
gulp.task('images', () => {
  return gulp.src('./images/**')
    .pipe(image())
    .pipe(gulp.dest('dist/content'))
});

//Copy icons folder to dist
gulp.task('icons', () => {
  return gulp.src('icons/**')
    .pipe(gulp.dest('dist/icons'));
});

//Replace references in index.html with new minfied files
//Move into dist folder
gulp.task('html', () => {
  return gulp.src('index.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

//Delete all files in the dist folder
gulp.task('clean', () => {
  return del('dist/*');
});

//Build runs all above scripts,
//Clean runs first
gulp.task('build', ['clean'], (callback) => {
  return run(['scripts', 'styles', 'images', 'icons'], 'html', callback);
});

//Connect to Server
gulp.task('connect', () => {
  return connect.server({
    root: 'dist',
    livereload: true,
    port: 3000
  });
});

//Watch for changes in .js and .scss files,
//Reload is built into 'styles' and 'scripts' tasks
gulp.task('watch', () => {
  gulp.watch('./sass/**.scss', ['styles']);
  return gulp.watch('./js/**', ['scripts']);
});

//By default ('gulp' command)
//run 'build' first, then 'watch' and 'connect' in parallel
gulp.task('default', (callback) => {
  run('build', ['connect', 'watch'], callback);
});
