//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var redis = require('redis')
  , _ = require('underscore')
  , tracker = require('./tracker')
  , reporter = require('./reporter')
  , methods = _.extend(tracker, reporter);

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function createClient(port, host, options) {
  options = options || {};
  options = _.extend(options, { return_buffers: true });
  client = redis.createClient(port, host, options);

  _.each(methods, function (fn, name) {
    methods[name] = _.partial(fn, client);
  });

  methods.client = client;
  return methods;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.createClient = createClient;

