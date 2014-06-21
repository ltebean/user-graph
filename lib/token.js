module.exports = function(n) {
	var salt = 'ABCDEFGHIJKLMNOPQRSTUVWQYZ0123456789',
		key = '',
		len = n || 8,
		length = salt.length,
		i = 0;
	if (length < len) {
		while (salt.length < len) {
			salt += salt;
		}
		length = salt.length;
	}
	for (; i < len; key += salt.charAt(Math.floor(Math.random() * length)), i++);
	return key;
}