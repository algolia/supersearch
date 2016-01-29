var gulp = require('gulp');
var path = require('path');
var del = require('del');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');

//dev
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');

//deploy
var ghPages = require('gulp-gh-pages');

//css
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');

//html
var haml = require('gulp-haml');
var prettify = require('gulp-html-prettify');

//SVG
var inject = require('gulp-inject');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');

//js
var webpack = require('webpack-stream');
var webpackConfig = require("./webpack.config.js");

gulp.task('clean', function() {
  return del("build");
});

gulp.task('haml', function () {
  return gulp.src('src/*.haml')
  .pipe(haml())
  .pipe(gulp.dest('build'));
});

gulp.task('prettify', function(callback) {
  return gulp.src('build/*.html')
  .pipe(prettify({indent_char: ' ', indent_size: 2}))
  .pipe(gulp.dest('build'));
});

gulp.task('inlineSvg', function () {
  var svgs = gulp.src('src/svg/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('title').remove();
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({ inlineSvg: true }));
  function fileContents (filePath, file) {
    return file.contents.toString();
  }
  return gulp
  .src('build/index.html')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  gulp.src('src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('build'))
  .pipe(livereload());
});

gulp.task('js', function () {
  return gulp.src('src/js/app.js')
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('build/js'))
      .pipe(livereload());
});

gulp.task('copy', function () {
  gulp.src('favicon.ico')
  .pipe(gulp.dest('build'));
  gulp.src('src/img/**/*')
  .pipe(gulp.dest('build/img'));
  gulp.src('src/js/instantsearch.min.js')
  .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/img/**/*',['copy']);
  gulp.watch('src/scss/**/*.scss', ['sass','scss-lint']);
  gulp.watch('src/*.haml', ['build']);
  gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 1337,
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('build',['clean'], function(callback) {
  runSequence('copy','js','haml', 'inlineSvg', 'prettify', 'sass', callback);
});

gulp.task('dev', function(callback) {
  runSequence('build', 'watch','webserver', callback);
});

gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

gulp.task('scss-lint', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(scsslint({
      'config': '.scss-lint.yml'
    }));
});
