var expect = require('expect.js')
  , redis = require('redis')
  , async = require('async')
  , util = require('../lib/util')
  , activeUser = require('../lib/active-user');

var client, activity;

describe('reporting', function () {

  before(function (done) {
    activity = activeUser.createClient();
    client = activity.client;
    client.flushall(done);
  });

  describe('#daily', function () {

    it('should report the DAUs for the default action and current day', function (done) {
      activity.track(2);
      activity.track(10);
      activity.track(2345);
      activity.track(76589);

      activity.daily(function (err, num) {
        expect(num).to.be(4);
        done();
      });
    });

    it('should report the DAUs for a custom action and current day', function (done) {
      activity.track(3, 'commented');
      activity.track(800, 'commented');
      activity.track(12387, 'commented');

      activity.daily('commented', function (err, num) {
        expect(num).to.be(3);
        done();
      });
    });

    it('should report the DAUs for a custom action and specified day');
  });

});