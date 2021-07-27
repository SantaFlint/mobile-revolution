const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');

// Styles

const styles = function styles() {
    return gulp.src("source/less/style.less")
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(less())
      .pipe(postcss([
        autoprefixer(),
        csso
      ]))
      .pipe(sourcemap.write("."))
      .pipe(gulp.dest("source/css"))
      .pipe(sync.stream());
};

exports.styles = styles;
// Styles

// const styles = () => {
//   return gulp.src("source/less/style.less")
//     .pipe(plumber())
//     .pipe(sourcemap.init())
//     .pipe(less())
//     .pipe(postcss([
//       autoprefixer()
//     ]))
//     .pipe(sourcemap.write("."))
//     .pipe(gulp.dest("source/css"))
//     .pipe(sync.stream());
// }

// exports.styles = styles;

var scripts = function scripts() {
    return gulp.src('source/js/script.js')
    .pipe(terser())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('source/js'))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
