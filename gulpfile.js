'use strict';

var gulp = require( 'gulp' );

var jshint = require( 'gulp-jshint' );
var stylish = require( 'jshint-stylish' );

var mocha = require( 'gulp-mocha' );
var istanbul = require( 'gulp-istanbul' );
var lcov = require( 'mocha-lcov-reporter' );

gulp.task( 'jshint', function ( cb ) {
  gulp.src([
    './!(node_modules|coverage)+(*)/**/*.js'
  ])
  .pipe( jshint() )
  .pipe( jshint.reporter( stylish ) )
  .pipe( jshint.reporter( 'fail' ) );
});

gulp.task( 'test', function ( cb ) {
  gulp.src([
    './routes/**/!(test.js)+(*.js)',
    './app/index.js'
  ])
  .pipe( istanbul() )
  .on( 'finish', function(){
    gulp.src([
      './routes/**/test.js',
      './app/test.js'
    ])
    .pipe( mocha({ reporter: 'spec' }) )
    .pipe( istanbul.writeReports() )
    .on( 'end', cb );
  });
});

gulp.task( 'default', [ 'jshint', 'test' ] );
