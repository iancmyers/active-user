var expect = require('expect.js')
  , redis = require('redis')
  , util = require('../lib/util')
  , activeUser = require('../lib/active-user');

var client, activity;

describe('tracking', function () {

  before(function () {
    activity = activeUser.createClient();
    client = activity.client;
  });

  describe('#track', function () {

    it('should track with just an id', function (done) {
      activity.track(1);

      client.get(util.keyFor(), function (err, buffer) {
        if (err) return done(err);
        var binaryString = util.toBinaryString(buffer);
        expect(binaryString).to.be('1000000');
        done();
      });
    });

    it('should track with and id and an action', function (done) {
      activity.track(2, 'commented');

      client.get(util.keyFor('commented'), function (err, buffer) {
        if (err) return done(err);
        var binaryString = util.toBinaryString(buffer);
        expect(binaryString).to.be('100000');
        done();
      });
    });

  }); // end #track

  describe('#untrack', function () {

  }); // end #untrack

});