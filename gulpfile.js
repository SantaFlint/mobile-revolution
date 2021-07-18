const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sync = require('browser-sync');
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');



// Styles

const styles = () => {
    return gulp.src("source/less/style.less")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer(),
            csso,
        ]))
        .pipe(sourcemap.write("."))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("source/css"))
        .pipe(sync.stream());
}

exports.styles = styles;

const scripts = () => {
    return gulp.src('source/js/script.js')
        .pipe(terser())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('source/js'))
        .pipe(sync.stream());
}

exports.scripts = scripts;

// Server

const server = sync.create();

const reload = (done) => {
    server.reload();
    done();
}

const server = (done) => {
    sync.init({
        ui: false,
        cors: true,
        notify: false,
        server: {
            baseDir: './source'
        },
    });
    done();
}

exports.server = server;

// Watcher

const watcher = () => {
    gulp.watch('source/*.html', gulp.series(reload));
    gulp.watch('source/less/**/*.less', gulp.series(styles, reload));
    gulp.watch('source/js/script.js', gulp.series(scripts, reload));
}

exports.default = gulp.series(
    styles, scripts, server, watcher
);
