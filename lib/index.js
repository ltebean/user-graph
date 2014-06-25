var redis = require("redis");
var sf = require('string-format');
var async = require('async');
var user = require('./user');

function init(config) {
	var options = {
		client: redis.createClient(config.port || 6379, config.host || 'localhost', config.options || {}),
		namespace: config.namespace ? config.namespace + ':' : ''
	}
	return initWithRedisClient(options);

}

function initWithRedisClient(config) {
	return {
		user: function(name) {
			return user(name, config);
		}
	}
}


module.exports = {
	init: init,
	initWithRedisClient: initWithRedisClient
}

var API = function(options) {
	this.client = options.client;
	this.namespace = options.namespace ? options.namespace + ':' : '';
}

API.prototype.follow = function(user, target, cb) {
	this.client.multi()
		.sadd(this._followingKey(user), target)
		.sadd(this._followerKey(target), user)
		.exec(function(err, replies) {
			cb && cb(err);
		});
}

API.prototype.unfollow = function(user, target, cb) {
	this.client.multi()
		.srem(this._followingKey(user), target)
		.srem(this._followerKey(target), user)
		.exec(function(err, replies) {
			cb && cb(err);
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
			function calcultateRecommendation(followings, done) {
				var tempKey = self._getTempKey();
				var keys = [tempKey]
				followings.map(function(following) {
					keys.push(self._followingKey(following));
				});

				self.client.multi()
					.sunionstore(keys)
					.srem(tempKey, user)
					.sdiff(tempKey, self._followingKey(user))
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