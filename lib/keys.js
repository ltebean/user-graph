var token = require('./token');

function Keys(namespace) {
	this.namespace = namespace ? namespace + ':' : '';
}

module.exports = Keys;

Keys.prototype.followingKey = function(user) {
	return '{namespace}user:{user}:following'.format({
		namespace: this.namespace,
		user: user
	});
}

Keys.prototype.followerKey = function(user) {
	return '{namespace}user:{user}:follower'.format({
		namespace: this.namespace,
		user: user
	});
}

Keys.prototype.tempKey = function() {
	return '{namespace}temp:{token}'.format({
		namespace: this.namespace,
		token: token(10)
	});
}