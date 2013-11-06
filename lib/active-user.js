var bigint = require('bigint')
  , redis = require('redis')
  , moment = require('moment');

var client = redis.createClient(6379, null, { return_buffers: true });

function daily (action, date, callback) {

}

function track (id, action) {
  client.setbit(getKey(action), id, 1);
}

function untrack (id, action) {
  client.setbit(getKey(action), id, 0);
}

function getKey (action, date) {
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