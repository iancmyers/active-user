//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var util = require('./util')
  , moment = require('moment')
  , async = require('async')
  , bignum = require('bignum')
  , _ = require('underscore');

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

/**
  General Note:

  When using the active-user object, you do not need to pass in the client
  parameter. It is already filled in via underscore.js's #partial method.

  Example:

    var activity = activeUser.createClient();

    activity.daily(function (err, num) {
      console.log(num); // Today's daily active users.
    });
**/

/**
 * Reports hourly active users for a given date.
 *
 * @param {Object} client The Redis client.
 * @param {String} [action] The tracked action.
 * @param {String} [date] The date of the action. Defaults to the current day.
 * @param {Function (err Error, num Number)} callback
 */
function hourly (client, action, date, callback) {
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


/**
 * Reports daily active users for a given date.
 *
 * @param {Object} client The Redis client.
 * @param {String} [action] The tracked action.
 * @param {String} [date] The date of the action. Defaults to the current day.
 * @param {Function (err Error, num Number)} callback
 */
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


  var keys = _.times(24, function (n) {
    var day = date.startOf('day').add('hours', n);
    return util.keyFor(action, day);
  });
  activeUsers(client, keys, callback);
}

/**
 * Reports weekly active users for a given date.
 *
 * @param {Object} client The Redis client.
 * @param {String} [action] The tracked action.
 * @param {String} [date] The date of the action. Defaults to the current week.
 * @param {Function (err Error, num Number)} callback
 */
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

  var keys = _.times(7*24, function (n) {
    var day = date.startOf('week').add('hours', n);
    return util.keyFor(action, day);
  });

  activeUsers(client, keys, callback);
}

/**
 * Reports monthly active users for a given date.
 *
 * @param {Object} client The Redis client.
 * @param {String} [action] The tracked action.
 * @param {String} [date] The date of the action. Defaults to the current
          month.
 * @param {Function (err Error, num Number)} callback
 */
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

  var keys = _.times(24*date.daysInMonth(), function (n) {
    var day = date.startOf('month').add('hours', n);
    return util.keyFor(action, day);
  });

  activeUsers(client, keys, callback);
}

//-----------------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------------

/**
 * Determines the number of active users for a given set of active-user keys.
 *
 * @param {Object} client The Redis client.
 * @param {Array} keyOrKeys The Redis keys for the days to be fetched.
 * @param {Function (err Error, num Number)} callback
 */
function activeUsers (client, keyOrKeys, callback) {
  var keys = 'string' === typeof keyOrKeys ? [keyOrKeys] : keyOrKeys;

  async.map(keys, client.get.bind(client), function (err, results) {
    if (err) return callback(err);

    var binaryBigint = _.reduce(results, function (memo, buffer) {
      var dailyBigint = buffer ? bignum.fromBuffer(buffer) : bignum(0);
      return dailyBigint.or(memo);
    }, bignum(0));

    callback(null, cardinality(binaryBigint));
  });
}

/**
 * Caculates the cardinality of a BitSet.
 *
 * @param {Object} binaryBigint A Bigint BitSet.
 * @returns {Number} The cardinality of the BitSet.
 */
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
exports.monthly = monthly;
