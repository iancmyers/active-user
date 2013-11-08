//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var util = require('./util')
  , _ = require('underscore');

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function daily (client, action, date, callback) {
  // Assume we are missing a date.  
  if (arguments.length == 3) {
    callback = date;
    date = null;
  }

  // We have only a client and a callback.
  if (arguments.length == 2) {
    callback = action;
    action = null;
  }

  // If no callback is given, return a partially applied function.
  if (arguments.length == 1) {
    return _.partial(daily, client);
  }

  var key = util.keyFor(action, date);
  client.get(key, function (err, result) {
    if (err) return callback(err);
    callback(null, cardinality(result));
  });
}

//-----------------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------------

function cardinality (buffer) {
  var binaryString = util.toBinaryString(buffer)
    , len = binaryString.length
    , cardinality = 0

  for (var i = 0; i < len; i++) {
    if (binaryString.charAt(i) == '1') {
      cardinality++;
    }
  }

  return cardinality;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.daily = daily;