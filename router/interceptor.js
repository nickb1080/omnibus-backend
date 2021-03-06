'use strict';

var redisConfig = {
  port: process.env.REDIS_PORT || null,
  url: process.env.REDIS_URL || null,
  key: process.env.REDIS_KEY || null
};

var client, get, set;

var interpolateParams = require( '../modules/interpolate-params' );
var redis = require( 'redis' );
var Promise = require( 'bluebird' );

// set up redis client if we've got the env vars
if ( redisConfig.port && redisConfig.url && redisConfig.key ) {

  client = redis.createClient( redisConfig.port, redisConfig.url );
  get = Promise.promisify( client.get, client );
  set = Promise.promisify( client.set, client );

  client.auth( redisConfig.key );
  client.on( 'error', function ( error ) {
    console.log( error );
  });
}

function saveToCache ( key, value ) {
  var str = typeof value === 'string' ? value : JSON.stringify( value );
  set( key, str );
  return value;
}

var tryCache = function ( key ) {
  return get( key ).then( function ( response ) {
    return new Promise( function ( resolve, reject ) {
      if ( response ) {
        resolve( response );
      } else {
        reject();
      }
    });
  });
};

var cacheInterceptor = function ( req, fallback, args ) {
  var path = interpolateParams( req.path, req.params );
  if ( !Array.isArray( args ) ) {
    args = [ args ];
  }

  if ( args == null ) {
    args = [];
  }

  if ( !client || req.query.force ) {
    return fallback.apply( null, args ).then( function( response ) {
      if ( client ) {
        saveToCache( path, response );
      }
      return response;
    });
  }

  return tryCache( path )
    // found in cache
    .then( function ( response ) {
      response = typeof response === 'string' ?
        JSON.parse( response ) :
        response;
      return response;
    })
    // not in cache
    .catch( function () {
      return fallback.apply( null, args ).then( function ( response ) {
        return saveToCache( path, response );
      });
    });
};

module.exports = cacheInterceptor;
