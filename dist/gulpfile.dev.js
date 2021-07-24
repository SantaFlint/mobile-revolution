"use strict";

var autoprefixer = require('autoprefixer');

var csso = require('postcss-csso');

var gulp = require('gulp');

var less = require('gulp-less');

var postcss = require('gulp-postcss');

var rename = require('gulp-rename');

var sync = require('browser-sync');

var terser = require('gulp-terser');

var plumber = require('gulp-plumber');

var sourcemap = require('gulp-sourcemaps'); // Styles


var styles = function styles() {
  return gulp.src("source/less/style.less").pipe(plumber()).pipe(sourcemap.init()).pipe(less()).pipe(postcss([autoprefixer(), csso])).pipe(sourcemap.write(".")).pipe(rename({
    suffix: '.min'
  })).pipe(gulp.dest("source/css")).pipe(sync.stream());
};

exports.styles = styles;

var scripts = function scripts() {
  return gulp.src('source/js/script.js').pipe(terser()).pipe(rename({
    suffix: '.min'
  })).pipe(gulp.dest('source/js')).pipe(sync.stream());
};

exports.scripts = scripts; // Server
// const server = sync.create();

var reload = function reload(done) {
  server.reload();
  done();
};

var server = function server(done) {
  sync.init({
    ui: false,
    cors: true,
    notify: false,
    server: {
      baseDir: './source'
    }
  });
  done();
};

exports.server = server; // Watcher

var watcher = function watcher() {
  gulp.watch('source/*.html', gulp.series(reload));
  gulp.watch('source/less/**/*.less', gulp.series(styles, reload));
  gulp.watch('source/js/script.js', gulp.series(scripts, reload));
};

exports["default"] = gulp.series(styles, scripts, server, watcher);