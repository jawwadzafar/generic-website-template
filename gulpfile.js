var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  svgmin = require('gulp-svgmin'),
  htmlmin = require('gulp-htmlmin'),
  package = require('./package.json');

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('htmlminify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('svg', function() {
  return gulp.src('src/svg/*')
    .pipe(svgmin())
    .pipe(gulp.dest('public/assets/img/svg'));
});


gulp.task('css', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      package: package
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  gulp.src('src/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(header(banner, {
      package: package
    }))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(uglify())
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(header(banner, {
      package: package
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    server: {
      baseDir: "public"
    }
  });
});
gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['htmlminify', 'css', 'js', 'svg', 'browser-sync'], function() {
  gulp.watch("src/scss/**/*.scss", ['css']);
  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("src/*.html", ['htmlminify']);
  gulp.watch("src/svg/*.svg", ['svg']);
  gulp.watch("public/*.html", ['bs-reload']);
});
