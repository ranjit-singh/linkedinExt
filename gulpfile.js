var  gulp = require('gulp'),
     gutil = require('gulp-util'),
     less = require('gulp-less'),
     path = require('path'),
     size = require('gulp-size'),
     clean = require('gulp-clean'),
     uglify = require('gulp-uglify'),
     jslint = require('gulp-jslint'),
     rev = require('gulp-rev'),
     usemin = require('gulp-usemin'),
     uncss = require('gulp-uncss'),
     watch = require('gulp-watch'),
     autoprefixer = require('gulp-autoprefixer'),
     minifyCSS = require('gulp-minify-css'),
     wiredep = require('wiredep').stream,
     inject = require('gulp-inject');

 var filesToMove = [
   './development/*.html',
   './development/fonts/**/*.*',
   './development/images/**/*.*',
   './development/views/**/*.*',
   './development/background.js',
   './development/manifest.json',
   './development/scripts/**/*.json*'
    ];

    gulp.task('bower', function () {
    gulp.src('./development/index.html')
      .pipe(wiredep())
      .pipe(gulp.dest('./development'));
    });

    //CSS Task to convert less to css, autoprefix, minify css
    gulp.task('css', function () {
       gulp.src('./development/styles/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'style', 'less') ]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS({
            keepBreaks:false,
            advanced: true
        }))
        .pipe(gulp.dest('development/styles/'))
        .on('error', gutil.log);
    });

    gulp.task('clean', function () {
      gulp.src('production/**/*.*', {read: false})
      .pipe(clean());
    });

    gulp.task('build', function () {

    gulp.src('./development/styles/main.less')
     .pipe(less({
         paths: [ path.join(__dirname, 'style', 'less') ]
     }))
     .pipe(autoprefixer({
         browsers: ['last 2 versions'],
         cascade: false
     }))
     .pipe(minifyCSS({
         keepBreaks:false,
         advanced: true
     }))
     .pipe(gulp.dest('development/styles/'))
     .on('error', gutil.log);

     gulp.src('development/index.html')
       .pipe(usemin({
         vendorcss:[minifyCSS(), rev()],
         main:[minifyCSS(), rev()],
         vendor: [uglify(), rev()],
         wittyparrot: [uglify(), rev()]
       }))
       .pipe(gulp.dest('./production'))
       .on('error', gutil.log);

       gulp.src(filesToMove, { base: './development' })
         .pipe(gulp.dest('./production'))
       .on('error', function (error) {
           console.error(String(error));
       });

});


    gulp.task('uncss', function() {
        gulp.src('./development/styles/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'style', 'less') ]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS({
            keepBreaks:false,
            advanced: true
        }))
        .pipe(size({
            title:'Before Uncss'
        }))
        .pipe(uncss({
            html: ['development/views/**/*.html']
        }))
        .pipe(size({
            title:'After Uncss'
        }))
        .pipe(gulp.dest('development/styles/gulp/uncss'))
        .on('error', gutil.log);
    });
