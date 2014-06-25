var async = require('async');
var Keys = require('../keys');

function User(user, options) {
	this.user = user;
	this.client = options.client;
	this.keys = new Keys(options.namespace);
}

module.exports = User;

User.prototype.follow = function(target, cb) {
	this.client.multi()
		.sadd(this.keys.followingKey(this.user), target)
		.sadd(this.keys.followerKey(target), this.user)
		.exec(function(err, replies) {
			cb && cb(err);
		});
}

User.prototype.unfollow = function(target, cb) {
	this.client.multi()
		.srem(this.keys.followingKey(this.user), target)
		.srem(this.keys.followerKey(target), this.user)
		.exec(function(err, replies) {
			cb && cb(err);
		});
}

User.prototype.followers = function(cb) {
	this.client.smembers(this.keys.followerKey(this.user), cb);
}

User.prototype.following = function(cb) {
	this.client.smembers(this.keys.followingKey(this.user), cb);
}

User.prototype.friends = function(cb) {
	this.client.sinter(this.keys.followingKey(this.user), this.keys.followerKey(this.user), cb);
}

User.prototype.followersCount = function(cb) {
	this.client.scard(this.keys.followerKey(this.user), cb);
}

User.prototype.followingCount = function(cb) {
	this.client.scard(this.keys.followingKey(this.user), cb);
}

User.prototype.isFollowing = function(target, cb) {
	this.client.sismember(this.keys.followingKey(this.user), target, cb)
}

User.prototype.isFollowedBy = function(target, cb) {
	this.client.sismember(this.keys.followerKey(this.user), target, cb)
}

User.prototype.recommendation = function(cb) {
	var self=this
	async.waterfall([

			function getRandomFollowing(done) {
				self.client.srandmember(self.keys.followingKey(self.user), 10, done);
			},
			function calcultateRecommendation(followings, done) {
				var tempKey = self.keys.tempKey();
				var keyArray = [tempKey]
				followings.map(function(following) {
					keyArray.push(self.keys.followingKey(following));
				});
				self.client.multi()
					.sunionstore(keyArray)
					.srem(tempKey, self.user)
					.sdiff(tempKey, self.keys.followingKey(self.user))
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