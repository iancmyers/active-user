var expect = require('expect.js')
  , redis = require('redis')
  , async = require('async')
  , util = require('../lib/util')
  , activeUser = require('../lib/active-user');

var client, activity;

describe('tracking', function () {

  before(function (done) {
    activity = activeUser.createClient();
    client = activity.client;
    client.flushall(done);
  });

  describe('#track', function () {
    it('should track with just an id', function (done) {
      var test = activity.track(1);

      client.get(util.keyFor(), function (err, buffer) {
        if (err) return done(err);
        var binaryString = util.toBinaryString(buffer);
        expect(binaryString).to.be('1000000');
        done();
      });
    });

    it('should track with an id and an action', function (done) {
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
    it('should untrack with just an id', function (done) {
      async.series([
        function (callback) {
          activity.track(1);

          client.get(util.keyFor(), function (err, buffer) {
            if (err) return callback(err);
            var binaryString = util.toBinaryString(buffer);
            expect(binaryString).to.be('1000000');
            callback(null, buffer);
          });
        },

        function (callback) {
          activity.untrack(1);

          client.get(util.keyFor(), function (err, buffer) {
            if (err) return callback(err);
            var binaryString = util.toBinaryString(buffer);
            expect(binaryString).to.be('0');
            callback(null, buffer);
          });
        }
      ], done);
    });

    it('should untrack with an id and an action', function (done) {
      async.series([
        function (callback) {
          activity.track(2, 'commented');

          client.get(util.keyFor('commented'), function (err, buffer) {
            if (err) return callback(err);
            var binaryString = util.toBinaryString(buffer);
            expect(binaryString).to.be('100000');
            callback(null, buffer);
          });
        },

        function (callback) {
          activity.untrack(2, 'commented');

          client.get(util.keyFor('commented'), function (err, buffer) {
            if (err) return callback(err);
            var binaryString = util.toBinaryString(buffer);
            expect(binaryString).to.be('0');
            callback(null, buffer);
          });
        }
      ], done);
    });

  }); // end #untrack

});
