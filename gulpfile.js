var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var del = require('del');
var ejs = require("gulp-ejs");
var rmindentation = require('gulp-rmindentation');

gulp.task('clean', function () {
  del.sync('./example');
});

gulp.task('template', function(){
  gulp.src(['./src/template/*.ejs',  '!./src/template/_*.ejs'])
    .pipe(ejs({}, {ext: '.html'}))
    .pipe(rmindentation())
    .pipe(gulp.dest('./example/html'));
});

gulp.task('img', function(){
  gulp.src('./src/img/**/*').pipe(gulp.dest('./example/img'));
});

gulp.task('js', function(){
  gulp.src('./src/js/**/*').pipe(gulp.dest('./example/js'));
  gulp.src('./src/vendor/**/*.js').pipe(concat('vendor.js')).pipe(gulp.dest('./example/vendor/js'));
});

gulp.task('css', function(){
  gulp.src(['./src/style/common/foundation.scss', './src/style/**/*'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 versions'] })
    ]))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./example/style'));
  gulp.src('./src/vendor/**/*.css').pipe(concat('vendor.css')).pipe(gulp.dest('./example/vendor/style'));
});

gulp.task('watch',function(){
  gulp.watch('./src/**/*', ['build:dev']);
  gulp.watch('./example/**/*').on('change', browserSync.reload);
});

gulp.task('server', function(){
  browserSync.init({
    server:["./example", "./example/html"]
  })
});

gulp.task('build', ['clean', 'template', 'img', 'js', 'css']);
gulp.task('build:dev', ['template', 'img', 'js', 'css']);
gulp.task("dev", ['build:dev', 'watch', 'server']);