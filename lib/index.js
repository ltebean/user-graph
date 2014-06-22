var redis = require("redis");
var sf = require('string-format');
var async = require('async');
var token = require('./token');

exports.init = function(config) {
	return new API({
		client: redis.createClient(config.port||6379, config.host||'localhost', config.options||{}),
		namespace: config.namespace
	});
}

exports.initWithRedisClient = function(config) {
	return new API({
		client: config.client,
		namespace: config.namespace
	});
}

var API = function(options) {
	this.client = options.client;
	this.namespace = options.namespace ? options.namespace + ':' : '';
}

API.prototype.follow = function(user, target, cb) {
	var self = this;
	async.parallel([

			function setFollowing(done) {
				self.client.sadd(self._followingKey(user), target, done);
			},
			function setFollower(done) {
				self.client.sadd(self._followerKey(target), user, done);
			}
		],
		function(err, results) {
			cb(err);
		});
}

API.prototype.unfollow = function(user, target, cb) {
	var self = this;
	async.parallel([

			function removeFollowing(done) {
				self.client.srem(self._followingKey(user), target, done);
			},
			function removeFollower(done) {
				self.client.srem(self._followerKey(target), user, done);
			}
		],
		function(err, results) {
			cb(err);
		});
}

API.prototype.getFollowers = function(user, cb) {
	this.client.smembers(this._followerKey(user), cb);
}

API.prototype.getFollowing = function(user, cb) {
	this.client.smembers(this._followingKey(user), cb);
}

API.prototype.getFriends = function(user, cb) {
	this.client.sinter(this._followingKey(user), this._followerKey(user), cb);
}

API.prototype.getFollowersCount = function(user, cb) {
	this.client.scard(this._followerKey(user), cb);
}

API.prototype.getFollowingCount = function(user, cb) {
	this.client.scard(this._followingKey(user), cb);
}

API.prototype.getRecommendation = function(user, cb) {
	var self = this;
	async.waterfall([

			function getRandomFollowing(done) {
				self.client.srandmember(self._followingKey(user), 10, done);
			},
			function getUnionOfTheirFollowing(followingSet, done) {
				var tempKey = self._getTempKey();
				var keys = [tempKey]
				followingSet.map(function(following) {
					keys.push(self._followingKey(following));
				});
				self.client.sunionstore(keys, function(err) {
					done(err, tempKey);
				});
			},
			function removeSelf(tempKey, done) {
				self.client.srem(tempKey, user, function(err) {
					done(err, tempKey);
				})
			},
			function diffWithSelf(tempKey, done) {
				self.client.sdiff(tempKey, self._followingKey(user), function(err, result) {
					self.client.del(tempKey, function(err) {
						done(err, result);
					});
				});
			}
		],
		function(err, results) {
			cb(err, results);
		});
}


API.prototype._followingKey = function(user, namespace) {
	return '{namespace}user:{user}:following'.format({
		namespace: this.namespace,
		user: user
	});
}


API.prototype._followerKey = function(user, namespace) {
	return '{namespace}user:{user}:follower'.format({
		namespace: this.namespace,
		user: user
	});
}

API.prototype._getTempKey = function(namespace) {
	return '{namespace}temp:{token}'.format({
		namespace: this.namespace,
		token: token(10)
	});
}