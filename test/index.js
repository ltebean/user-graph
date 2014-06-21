var client = require('../').createClient({
	host: '127.0.0.1',
	port: '6379',
	options: {},
	namespace: 'usergraph'
});

client.follow('ltebean', 'kael', function(err, res) {})
client.follow('ltebean', 'spud', function(err, res) {})

client.follow('spud', 'kael', function(err, res) {})
client.follow('spud', 'ltebean', function(err, res) {})
client.follow('spud', 'villa', function(err, res) {})

client.follow('kael', 'TJ', function(err, res) {})
client.follow('kael', 'ltebean', function(err, res) {})

client.getFollowers('kael', function(err, users) {
	console.log("kael's followers: %s",users);
})

client.getFollowing('ltebean', function(err, users) {
	console.log("ltebean is following: %s",users);
})

client.getFriends('ltebean',function(err,users){
	console.log("ltebean's friends: %s",users);
})

client.getRecommendation('ltebean',function(err,users){
	console.log("ltebean's recommendation: %s",users);
})