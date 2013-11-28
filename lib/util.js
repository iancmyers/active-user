//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var bigint = require('bigint')
  , moment = require('moment');

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function keyFor (action, date) {
  action = action || 'active';

  if (!moment.isMoment(date)) {
    date = date ? moment.utc(date) : moment.utc();
  }

  date = date.format('YYYY-MM-DD');
  return [action, date].join('-');
}

function toBinaryString (buffer) {
  var binaryBigint = bigint.fromBuffer(buffer);
  return binaryBigint.toString(2);
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.keyFor = keyFor;
exports.toBinaryString = toBinaryString;