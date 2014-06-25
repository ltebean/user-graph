var async = require('async');

module.exports = function user(user, options) {
	var user = user;
	var client = options.client;
	var keys = require('../keys')(options.namespace);

	return {
		follow: function(target, cb) {
			follow(target, cb);
		},
		unfollow: function(target, cb) {
			unfollow(target, cb);
		},
		followers: function(cb) {
			followers(cb);
		},
		following: function(cb) {
			following(cb)
		},
		followersCount: function(cb) {
			followersCount(cb);
		},
		followingCount: function(cb) {
			followingCount(cb)
		},
		friends: function(cb) {
			friends(cb)
		},
		recommendation: function(cb) {
			recommendation(cb)
		}
	}

	function follow(target, cb) {
		client.multi()
			.sadd(keys.followingKey(user), target)
			.sadd(keys.followerKey(target), user)
			.exec(function(err, replies) {
				cb && cb(err);
			});
	}

	function unfollow(target, cb) {
		client.multi()
			.srem(keys.followingKey(user), target)
			.srem(keys.followerKey(target), user)
			.exec(function(err, replies) {
				cb && cb(err);
			});
	}

	function followers(cb) {
		client.smembers(keys.followerKey(user), cb);
	}

	function following(cb) {
		client.smembers(keys.followingKey(user), cb);
	}

	function friends(cb) {
		client.sinter(keys.followingKey(user), keys.followerKey(user), cb);
	}

	function followersCount(cb) {
		client.scard(keys.followerKey(user), cb);
	}

	function followingCount(cb) {
		client.scard(keys.followingKey(user), cb);
	}

	function recommendation(cb) {
		async.waterfall([
				function getRandomFollowing(done) {
					client.srandmember(keys.followingKey(user), 10, done);
				},
				function calcultateRecommendation(followings, done) {
					var tempKey = keys.tempKey();
					var keyArray = [tempKey]
					followings.map(function(following) {
						keyArray.push(keys.followingKey(following));
					});
					client.multi()
						.sunionstore(keyArray)
						.srem(tempKey, user)
						.sdiff(tempKey, keys.followingKey(user))
						.del(tempKey)
						.exec(function(err, replies) {
							done(err, replies[2]);
						})
				}
			],
			function(err, results) {
				cb(err, results);
			});
	}


}