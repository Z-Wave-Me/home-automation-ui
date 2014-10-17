var BUILD_DIRECTORY = './dist',
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    cssBase64 = require('gulp-css-base64'),
    concat = require("gulp-concat"),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    manifest = require('gulp-manifest'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence'),
    rimraf = require('gulp-rimraf'),
    htmlmin = require('gulp-htmlmin');

gulp.task('less', function () {
    gulp.src('./public/less/all.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssBase64())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(sourcemaps.write('./'))
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest(BUILD_DIRECTORY + '/public/css'));

    return gulp.src('./public/fonts/*')
        .pipe(gulp.dest(BUILD_DIRECTORY + '/public/fonts'));
});

gulp.task("build", function () {

    rjs({
        baseUrl: './js',
        name: 'main',
        mainConfigFile: 'js/main.js',
        include: [
            'requireLib',
            './bootstrap'
        ],
        out: 'main-built.js'
    })
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_DIRECTORY + '/js')); // pipe it to the output DIR

});

gulp.task('manifest', function () {
    return gulp.src([
        BUILD_DIRECTORY + '/*',
        BUILD_DIRECTORY + '/**/*.*'
    ])
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['http://*', 'https://*', '*'],
            filename: 'app.manifest',
            exclude: 'app.manifest'
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('create_index', function () {
    return gulp.src('./index.tmpl.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename("index.html"))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('copy_other', function () {
    return gulp.src([
        './favicon.ico',
        './robots.txt',
        './apple-touch-icon-precomposed.png',
        './humans.txt'
    ])
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
    return gulp.src(BUILD_DIRECTORY, {read: false})
        .pipe(rimraf());
});

// validate
gulp.task('lint', function() {
    return gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function () {
    return gulp.src('./js/**/*.js')
        .pipe(jscs());
});

// server
gulp.task('connect', function () {
    connect.server({
        root: './',
        livereload: true
    });
});

gulp.task('reload', function () {
    gulp.src('./js/**/*.js')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch([
        './js/**/*.js'
    ], ['reload']);
});

// tasks
gulp.task('default', function (callback) {
    runSequence('clean', ['less', 'build', 'create_index'], 'manifest', 'copy_other', callback);
});
gulp.task('develop_server', ['connect', 'watch']);
gulp.task('validate', ['lint', 'jscs']);