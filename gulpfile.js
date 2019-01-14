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
  imagemin = require('gulp-imagemin');
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

gulp.task('favicon', function() {
  return gulp.src('src/*.ico')
  .pipe(gulp.dest('public'));
});

gulp.task('img', function() {
  return gulp.src('src/assets/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/assets/img'));
});


gulp.task('css', function() {
  return gulp.src('src/assets/scss/style.scss')
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
  gulp.src('src/assets/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
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

gulp.task('default', ['htmlminify', 'css', 'js', 'favicon', 'img', 'browser-sync'], function() {
    gulp.watch("src/assets/scss/**/*.scss", ['css']);
    gulp.watch("src/assets/js/*.js", ['js']);
    gulp.watch("src/*.html", ['htmlminify']);
    gulp.watch("src/*.ico", ['favicon']);
    gulp.watch("src/assets/img/*.{png,jpg,jpeg,gif,svg}", ['img']);
    gulp.watch("public/*.html", ['bs-reload']);
});
