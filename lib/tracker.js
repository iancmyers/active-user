//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var util = require('./util')
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

    activity.track(1, 'commented');
**/

/**
 * Tracks an action in active-user.
 *
 * @param {Object} client The Redis client.
 * @param {Number} id The id of the user being tracked.
 * @param {String} [action] The action being tracked.
 * @returns {Boolean}
 */
function track (client, id, action) {
  return client.setbit(util.keyFor(action), id, 1);
}

/**
 * Un-tracks an action in active-user.
 *
 * @param {Object} client The Redis client.
 * @param {Number} id The id of the user being tracked.
 * @param {String} [action] The action being tracked.
 * @returns {Boolean}
 */
function untrack (client, id, action) {
  return client.setbit(util.keyFor(action), id, 0);
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.track = track;
exports.untrack = untrack;
