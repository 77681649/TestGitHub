/**
 * @description 消息中心（观察者模式）
 *
 * 提供订阅，发布消息的功能
 */

var slice = [].slice;

function MessageCenter() {
	this.messages = {}
}

MessageCenter.subscribe = function(name, fn, context) {
	if (!this.messages[name]) this.messages[name] = [];

	this.messages[name].push({
		fn: fn,
		context: context || this
	});
};

MessageCenter.unsubscribe = function(name, fn) {
	var
		message = this.messages[name];

	if (!message) return;

	for (var i = 0, len = message.length; i < len; i++) {
		if (fn === message[i].fn) {
			messages.splice(i, 1);
			break;
		}
	}
};

MessageCenter.publish = function(name) {
	var
		message = this.messages[name];

	if (!message) return;

	message.forEach(function(mesasge) {
		mesasge.fn.apply(mesasge.context, slice.call(arguments, 1));
	});
};

MessageCenter.clear = function() {
	this.messages = {};
};