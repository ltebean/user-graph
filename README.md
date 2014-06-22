##Usage

```javascript
var graph = require('user-graph').init({
	host: '127.0.0.1',
	port: '6379',
	options: {},
	namespace: 'usergraph'
});

graph.follow('ltebean', 'kael', function(err, res) {})
graph.follow('ltebean', 'spud', function(err, res) {})

graph.follow('spud', 'kael', function(err, res) {})
graph.follow('spud', 'ltebean', function(err, res) {})
graph.follow('spud', 'villa', function(err, res) {})

graph.follow('kael', 'TJ', function(err, res) {})
graph.follow('kael', 'ltebean', function(err, res) {})

graph.getFollowers('kael', function(err, users) {
	console.log("kael's followers: %s",users);
	// kael's followers: 2
})

graph.getFollowing('ltebean', function(err, users) {
	console.log("ltebean is following: %s",users);
	// ltebean is following: kael,spud
})

graph.getFriends('ltebean',function(err,users){
	console.log("ltebean's friends: %s",users);
	// ltebean's friends: kael,spud
})

graph.getRecommendation('ltebean',function(err,users){
	console.log("recommendation for ltebean: %s",users);
	// ecommendation for ltebean: TJ,villa
})
```