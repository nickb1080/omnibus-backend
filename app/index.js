'use strict';

var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'static-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );

var app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

app.use( cors() );
app.use( favicon() );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ));

var apiRouter = require( '../router' );
app.use( '/api/', apiRouter );

/// catch 404 and forwarding to error handler
app.use( function ( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
});

/// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
  app.use( function ( err, req, res, next ) {
    res.json( err.status, { err: err.toString(), stackTrace: err.stack.toString() });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
  res.json( err.status );
});

app.launch = function ( port ) {
  this.set('port', process.env.PORT || port || 3000);
  var server = this.listen( this.get('port'), function() {
    console.log( 'Express server listening on port ' + server.address().port );
  });
};

module.exports = app;
