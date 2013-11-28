//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var util = require('./util')
  , moment = require('moment')
  , async = require('async')
  , bigint = require('bigint')
  , _ = require('underscore');

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function daily (client, action, date, callback) {
  if (arguments.length == 4) {
    date = moment.utc(date);
  }

  // Assume we are missing a date.  
  if (arguments.length == 3) {
    callback = date;
    date = moment.utc();
  }

  // We have only a client and a callback.
  if (arguments.length == 2) {
    callback = action;
    action = null;
    date = moment.utc();
  }

  var key = util.keyFor(action, date);
  activeUsers(client, key, callback);
}

function weekly (client, action, date, callback) {
  if (arguments.length == 4) {
    date = moment.utc(date);
  }

  // Assume we are missing a date.  
  if (arguments.length == 3) {
    callback = date;
    date = moment.utc();
  }

  // We have only a client and a callback.
  if (arguments.length == 2) {
    callback = action;
    action = null;
    date = moment.utc();
  }

  var keys = _.times(7, function (n) {
    var day = date.startOf('week').add('days', n - 1);
    return util.keyFor(action, day);
  });

  activeUsers(client, keys, callback);
}

function monthly (client, action, date, callback) {
  if (arguments.length == 4) {
    date = moment.utc(date);
  }

  // Assume we are missing a date.  
  if (arguments.length == 3) {
    callback = date;
    date = moment.utc();
  }

  // We have only a client and a callback.
  if (arguments.length == 2) {
    callback = action;
    action = null;
    date = moment.utc();
  }

  var keys = _.times(date.daysInMonth(), function (n) {
    var day = date.startOf('month').add('days', n - 1);
    return util.keyFor(action, day);
  });

  activeUsers(client, keys, callback);
}

//-----------------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------------

function activeUsers (client, keyOrKeys, callback) {
  var keys = 'string' === typeof keyOrKeys ? [keyOrKeys] : keyOrKeys;

  async.map(keys, client.get.bind(client), function (err, results) {
    if (err) return callback(err);

    var binaryBigint = _.reduce(results, function (memo, buffer) {
      var dailyBigint = buffer ? bigint.fromBuffer(buffer) : bigint(0);
      return dailyBigint.or(memo);
    }, bigint(0));

    callback(null, cardinality(binaryBigint));
  });
}

function cardinality (binaryBigint) {
  var binaryString = binaryBigint.toString(2)
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
exports.weekly = weekly;