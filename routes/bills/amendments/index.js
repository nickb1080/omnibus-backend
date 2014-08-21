'use strict';

var TimesApi = require( 'nyt-congress-node' );
var NYT = process.env.NYT_CONGRESS_KEY || 'test';
var timesApi = new TimesApi( NYT );

module.exports = function ( req ) {

  var id = req.params.id.split( '-' );
  var congressNumber = id[0];
  var billNumber = id[1];

  return timesApi.billAmendments({
    billId: billNumber,
    congressNumber: congressNumber
  });
};
