# Hourly Active User

The `hau` module allows you to quickly track hourly, daily, weekly, and monthly active users in Redis.

Hourly? Yeah, [hourly](https://medium.com/@anamitra/the-shape-of-the-curve-5b869a38684a).

Check out this article to better understand library implementation: https://blog.getspool.com/2011/11/29/fast-easy-realtime-metrics-using-redis-bitmaps/

## Installing and Getting Started

You can install the `hau` module via npm. You will also need to have a [Redis server](http://redis.io) instance running.

```bash
npm install hau
```

Once `hau` is installed we need a client:

```js
var hau = require('hau');

var activity = hau.createClient(REDIS_PORT, REDIS_HOST, REDIS_OPTIONS);
```

## Tracking

###activity.track(id, [action]);

Tracking is a very simple operation:

```js
activity.track(10, 'commented');
activity.track(1);
```

Where the **id** is the id of the user you want to track and the action is the action they performed.

###activity.untrack(id, [action]);

You may also undo a tracked action for a user with `untrack`:

```js
activity.untrack(10, 'commented');
activity.untrack(1);
```

## Reporting

You can fetch the daily, weekly, and monthly active users easily:

###activity.daily([action], [date], callback);

```js
// Fetching the number of users who commented on Nov 21, 2013
activity.daily('commented', '2013-11-21', function (err, num) {
  console.log(num);
});

// Fetching the number of daily active users for the current day
activity.daily(function (err, num) {
  console.log(num);
});

// Using promises to fetch the number of users who commented on Nov 21, 2013
const { promisify } = require('util');
const activityDaily = promisify(activity.daily);
const daily = await activityDaily('commented', '2013-11-21');

// Using promises to fetch the number of daily active users for the current day
const { promisify } = require('util');
const activityDaily = promisify(activity.daily);
const daily = await activityDaily();
```

###activity.weekly([action], [date], callback);

```js
// Fetching the number of users who commented the week containing Nov 21, 2013
activity.weekly('commented', '2013-11-21', function (err, num) {
  console.log(num);
});

// Fetching the number of daily active users for the current week
activity.weekly(function (err, num) {
  console.log(num);
});
```

###activity.monthly([action], [date], callback);

```js
// Fetching the number of users who commented the month of Nov 2013
activity.monthly('commented', '2013-11', function (err, num) {
  console.log(num);
});

// Fetching the number of daily active users for the current month
activity.monthly(function (err, num) {
  console.log(num);
});
```

## Release History
* 0.0.1
    * First release (forked from [iancmyers](https://github.com/iancmyers)'s [active-user](https://github.com/iancmyers/active-user) module)
* 0.2.0
    * New updates made by [malcolmocean](https://github.com/malcolmocean)'s adding hourly support, and changing the dependency bigint to bignum
* 0.3.0
    * Remove dependency on `bignum`, now using BigInt, which is a native JS object