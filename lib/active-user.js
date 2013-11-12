//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var redis = require('redis')
  , _ = require('underscore')
  , tracker = require('./tracker')
  , reporter = require('./reporter')
  , methods = _.extend(tracker, reporter)
  , clients = {};

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function createClient(port, host, options) {
  options = options || {};
  options = _.extend(options, { return_buffers: true });
  client = redis.createClient(port, host, options);

  var activity = {};
  _.each(methods, function (fn, name) {
    activity[name] = _.partial(fn, client);
  });

  activity.client = client;
  return activity;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.createClient = createClient;

