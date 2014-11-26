var SUPPORT_LANGUAGES = ['en', 'ru', 'de'],
    BUILD_DIRECTORY = './dist',
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    cssBase64 = require('gulp-css-base64'),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    manifest = require('gulp-manifest'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence'),
    htmlmin = require('gulp-htmlmin'),
    fs = require('fs'),
    _ = require('lodash'),
    del = require('del');

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
            'morearty',
            './bootstrap'
        ],
        optimize: "uglify2",
        skipDirOptimize: true,
        generateSourceMaps: true,
        findNestedDependencies: true,
        preserveLicenseComments: false,
        onBuildWrite: function (moduleName, path, singleContents) {
            return singleContents.replace(/jsx!/g, '');
        },
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
            exclude: [
                'app.manifest',
                'public/fonts/helveticaneue-bold.eot',
                'public/fonts/helveticaneue-bold.svg',
                'public/fonts/helveticaneue-bold.ttf',
                'public/fonts/helveticaneue.eot',
                'public/fonts/helveticaneue.svg',
                'public/fonts/helveticaneue.ttf',
                'index.html'
            ]
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('create_index', function () {
    return gulp.src('./index.tmpl.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename("index.html"))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('copy_language_file', function () {
    return gulp.src(SUPPORT_LANGUAGES.map(function (lang) {
        return './public/lang/language.' + lang + '.json';
    }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/public/lang'));
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

gulp.task('clean', function (cb) {
    del([
        BUILD_DIRECTORY + '/**',
        BUILD_DIRECTORY + '/'
    ], cb);
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

// internalization
gulp.task('check_lang_file', function () {
    var lang_dir = './public/lang/';

    fs.readFile(lang_dir + 'language.en.json', function (err, file) {
        var obj_en = JSON.parse(file);

        SUPPORT_LANGUAGES.forEach(function (lang) {
            if (lang === 'en') {
                return false;
            }

            var file_path = lang_dir + 'language.' + lang + '.json';

            fs.readFile(file_path, function (err, file) {
                if (err) {
                    return gulp.src(lang_dir + 'language.en.json')
                        .pipe(htmlmin({collapseWhitespace: false}))
                        .pipe(rename('language.' + lang + '.json'))
                        .pipe(gulp.dest(lang_dir));
                } else {
                    fs.writeFile(file_path, JSON.stringify(_.defaults(JSON.parse(file), obj_en), null, 4));
                }
            });
        });
    });
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

// build
gulp.task('default', function (callback) {
    runSequence(
        'clean',
        ['less', 'build', 'check_lang_file'],
        ['copy_language_file', 'create_index'],
        'manifest',
        'copy_other',
        callback);
});

gulp.task('develop_server', ['connect', 'watch']);

gulp.task('production_server', function () {
    connect.server({
        root: './dist/'
    });
});

gulp.task('validate', ['lint', 'jscs']);