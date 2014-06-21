##Usage

```javascript
var client = require('user-graph').createClient({
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
	// kael's followers: 2
})

client.getFollowing('ltebean', function(err, users) {
	console.log("ltebean is following: %s",users);
	// ltebean is following: kael,spud
})

client.getFriends('ltebean',function(err,users){
	console.log("ltebean's friends: %s",users);
	// ltebean's friends: kael,spud
})

client.getRecommendation('ltebean',function(err,users){
	console.log("recommendation for ltebean: %s",users);
	// ltebean's recommendation: TJ,villa
})
```