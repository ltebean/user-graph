var token = require('./token');

module.exports = function(n) {
	var namespace = n ? n + ':' : '';
	return {
		followingKey: function(user) {
			return '{namespace}user:{user}:following'.format({
				namespace: namespace,
				user: user
			})
		},
		followerKey: function(user) {
			return '{namespace}user:{user}:follower'.format({
				namespace: namespace,
				user: user
			});
		},
		tempKey: function() {
			return '{namespace}temp:{token}'.format({
				namespace: namespace,
				token: token(10)
			});
		}
	}
}