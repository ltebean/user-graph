##Usage

```javascript
var redis = require('redis');
var graph = require('../').initWithRedisClient({
	client: redis.createClient(),
	namespace: 'usergraph'
});

graph.user('ltebean').follow('kael', function(err, res) {});
graph.user('ltebean').follow('spud', function(err, res) {});

graph.user('spud').follow('kael', function(err, res) {});
graph.user('spud').follow('ltebean', function(err, res) {});
graph.user('spud').follow('villa', function(err, res) {});

graph.user('kael').follow('TJ', function(err, res) {});


graph.user('kael').followers(function(err, users) {
	console.log("kael's followers: %s", users);
	// kael's followers: ltebean,spud
})

graph.user('ltebean').following(function(err, users) {
	console.log("ltebean is following: %s", users);
	// ltebean is following: kael,spud
})

graph.user('ltebean').friends(function(err, users) {
	console.log("ltebean's friends: %s", users);
	// ltebean's friends: spud
})

graph.user('ltebean').recommendation(function(err, users) {
	console.log("recommendation for ltebean: %s", users);
	// recommendation for ltebean: TJ,villa
})

graph.user('ltebean').unfollow('whoever', function(err, res) {});

```