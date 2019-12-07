//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var moment = require('moment');

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

function keyFor (action, date) {
  action = action || 'active';

  if (!moment.isMoment(date)) {
    date = date ? moment.utc(date) : moment.utc();
  }

  date = date.format('YYYY-MM-DD-hh');
  return [action, date].join('-');
}

function toBinaryString (buffer) {
  const buffer64 = to64Bits(buffer);
  var binaryBigint = buffer64.readBigInt64BE();
  return binaryBigint.toString(2);
}

function to64Bits (buffer) {
  if (buffer.length < 8) {
    const bufZeros = Buffer.alloc(8 - buf.length);
    buffer = Buffer.concat([bufZeros, buffer], 8);
  }
  return buffer;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.keyFor = keyFor;
exports.toBinaryString = toBinaryString;
exports.to64Bits = to64Bits;
