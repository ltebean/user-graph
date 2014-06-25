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
})

graph.user('kael').followersCount(function(err, res) {
	console.log("kael's followers count: %s", res);
})

graph.user('ltebean').following(function(err, users) {
	console.log("ltebean is following: %s", users);
})

graph.user('kael').followingCount(function(err, res) {
	console.log("kael's following count: %s", res);
})

graph.user('ltebean').friends(function(err, users) {
	console.log("ltebean's friends: %s", users);
})

graph.user('ltebean').isFollowing('kael',function(err, users) {
	console.log("ltebean is following kael: %s", users);
})

graph.user('ltebean').isFollowedBy('kael',function(err, users) {
	console.log("ltebean is followed by kael", users);
})

graph.user('ltebean').recommendation(function(err, users) {
	console.log("recommendation for ltebean: %s", users);
})

// graph.user('ltebean').unfollow('whoever',function(err, users) {})