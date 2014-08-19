'use strict';

var request = require( 'request' );
var chai = require( 'chai' );
var expect = chai.expect;
var nock = require( 'nock' );

var replacer = {
  id: '113-HR2397'
};

var paramInterpolate = function ( str, obj ) {
  return str.replace( /:([a-zA-Z]+)/g, function( a, b ) {
    return obj[a.slice( 1 )];
  });
};

// pass data like:
// {
//    nockRoot: String,
//    nockPath: String,
//    appPath: String
//    params: Object
// }

var versionEndpointTest = function ( opts ) {

  nock( opts.nockRoot )
    .filteringPath( function () {
      return opts.nockPath;
    })
    .get( opts.nockPath )
    .reply( 200, {
      results: [{ versions:
        [
          { urls: { html: 'http://gpo.fake.gov/test' } },
          { urls: { html: 'http://gpo.fake.gov/test' } },
          { urls: { html: 'http://gpo.fake.gov/test' } }
        ]
      }]
    });

  nock( 'http://gpo.fake.gov' )
    .get( '/test' )
    .times( 4 )
    .reply( 200, [{
      body: 'body'
    }]);

  describe( opts.appPath + ' endpoint', function() {

    var server;
    var app;

    beforeEach( function () {
      app = require( '../../../app' );
      server = app.listen( 3000 );
    });

    afterEach( function () {
      server.close();
      delete require.cache[ '../../../app' ];
    });

    describe( 'GET /api' + opts.appPath, function () {

      it( 'Should serve GET requests to /api' + opts.appPath, function ( done ) {
        var url = paramInterpolate( 'http://localhost:3000/api' + opts.appPath, replacer );
        request( url, function ( err, resp, body ) {
          expect( err ).to.not.exist;
          expect( resp.statusCode ).to.equal( 200 );
          console.log( body );
          done();
        });
      });
    });
  });
};

versionEndpointTest({
  nockRoot: 'https://congress.api.sunlightfoundation.com',
  nockPath: '/bills/',
  appPath: '/bills/:id/versions'
});
