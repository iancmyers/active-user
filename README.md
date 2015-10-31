# Hourly Active User

The `hau` module allows you to quickly track hourly, daily, weekly, and monthly active users in Redis.

Hourly? Yeah, [hourly](https://medium.com/@anamitra/the-shape-of-the-curve-5b869a38684a).

This repo was forked from [iancmyers](https://github.com/iancmyers)'s [active-user](https://github.com/iancmyers/active-user) module. My update, in addition to adding hourly support, removes the dependency on `bigint`, now using `bignum`, which I *also* had to modify so that it would support conversion to binary strings. I spent all day on just that, and would love props [on twitter](https://twitter.com/Malcolm_Ocean) if you end up using this module.

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
