var bigint = require('bigint')
  , redis = require('redis')
  , moment = require('moment');

var client = redis.createClient(6379, null, { return_buffers: true });

function daily (action, date, callback) {
  client.get(keyFor(action, date), function (err, buffer) {
    if (err) return callback(err);
    var binaryBigint = bigint.fromBuffer(buffer);
    callback(null, cardinality(binaryBigint));
  });
}

function track (id, action) {
  client.setbit(keyFor(action), id, 1);
}

function untrack (id, action) {
  client.setbit(keyFor(action), id, 0);
}

function keyFor (action, date) {
  action = action || 'active';
  date = date ? moment.utc(date) : moment.utc();
  date = date.format('YYYY-MM-DD');
  return [action, date].join('-');
}

function cardinality (binaryBigint) {
  var binaryString = binaryBigint.toString(2)
    , len = binaryString.length
    , cardinality = 0

  for (var i = 0; i < len; i++) {
    if (binaryString.charAt(i) == 1) {
      cardinality++;
    }
  }

  return cardinality;
}