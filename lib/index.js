var redis = require("redis");
var sf = require('string-format');
var async = require('async');
var user = require('./user');

function init(config) {
	var options = {
		client: redis.createClient(config.port || 6379, config.host || 'localhost', config.options || {}),
		namespace: config.namespace
	}
	return initWithRedisClient(options);

}

function initWithRedisClient(config) {
	var options = {
		client: config.client,
		namespace: config.namespace ? config.namespace + ':' : ''
	}
	return {
		user: function(name) {
			return user(name, options);
		}
	}
}

module.exports = {
	init: init,
	initWithRedisClient: initWithRedisClient
}