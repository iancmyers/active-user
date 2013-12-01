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

    it('should report 0 for days with no information', function (done) {
      activity.daily('nothing', function (err, num) {
        expect(num).to.be(0);
        done();
      });
    });

    it('should report the DAUs for a custom action and specified day');
  });

  describe('#weekly', function () {

    before(function () {
      client.setbit(util.keyFor('favorited', '1986-09-23'), 10, 1);
      client.setbit(util.keyFor('favorited', '1986-09-24'), 10, 1);
      client.setbit(util.keyFor('favorited', '1986-09-24'), 11, 1);
      client.setbit(util.keyFor('favorited', '1986-09-24'), 1002, 1);
      client.setbit(util.keyFor('favorited', '1986-09-25'), 982, 1);
      client.setbit(util.keyFor('favorited', '1986-09-25'), 985, 1);
    });

    it('should report the WAU for a given action', function (done) {
      activity.weekly('favorited', '1986-09-24', function (err, num) {
        expect(num).to.be(5);
        done();
      });
    });

    it('should report 0 for weeks with no information', function (done) {
      activity.weekly('favorited', '1986-11-24', function (err, num) {
        expect(num).to.be(0);
        done();
      });
    });

  });

  describe('#monthly', function () {
    before(function () {
      client.setbit(util.keyFor('favorited', '1986-08-13'), 10, 1);
      client.setbit(util.keyFor('favorited', '1986-08-14'), 10, 1);
      client.setbit(util.keyFor('favorited', '1986-08-14'), 11, 1);
      client.setbit(util.keyFor('favorited', '1986-08-14'), 1002, 1);
      client.setbit(util.keyFor('favorited', '1986-08-15'), 982, 1);
      client.setbit(util.keyFor('favorited', '1986-08-15'), 985, 1);
      client.setbit(util.keyFor('favorited', '1986-08-23'), 20, 1);
      client.setbit(util.keyFor('favorited', '1986-08-24'), 20, 1);
      client.setbit(util.keyFor('favorited', '1986-08-24'), 21, 1);
      client.setbit(util.keyFor('favorited', '1986-08-24'), 2002, 1);
      client.setbit(util.keyFor('favorited', '1986-08-25'), 282, 1);
      client.setbit(util.keyFor('favorited', '1986-08-25'), 285, 1);
    });

    it('should report the MAU for a given action', function (done) {
      activity.monthly('favorited', '1986-08', function (err, num) {
        expect(num).to.be(9);
        done();
      });
    });

    it('should report 0 for months with no information', function (done) {
      activity.monthly('favorited', '1986-11', function (err, num) {
        expect(num).to.be(0);
        done();
      });
    });
  });

});