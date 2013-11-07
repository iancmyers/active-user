var expect = require('expect.js')
  , redis = require('redis')
  , moment = require('moment')
  , bigint = require('bigint')
  , activity = require('../lib/active-user');

var client;

describe('tracking', function () {

  before(function () {
    client = redis.createClient(6379, null, { return_buffers: true });
  })

  describe('#track', function () {

    it('should track with just an id', function (done) {
      activity.track(1);

      var key = activity.keyFor();
      client.get(key, function (err, buffer) {
        if (err) return done(err);
        var binaryString = activity.toBinaryString(buffer);
        expect(binaryString).to.be('1000000');
        done();
      });
    });

    it('should track with and id and an action', function (done) {
      activity.track(2, 'commented');

      var key = activity.keyFor('commented');
      client.get(key, function (err, buffer) {
        if (err) return done(err);
        var binaryString = activity.toBinaryString(buffer);
        expect(binaryString).to.be('100000');
        done();
      });
    });

  }); // end #track

  describe('#untrack', function (){

  }); // end #untrack

});