/**
 * XHR连接队列
 *
 * 请求存储在浏览器内存中的一个队列化数组中
 * 刷新队列时每个请求都要按"先入先出"的顺序发送给一个后端的Web服务
 *
 * 请求顺序可控
 * 有取消功能
 * 支持重试功能
 * 支持超时功能
 * 入列、出列、刷新队列
 */

var AjaxQueue = function() {
	this._queue = [];

	this.currentRetry = 0;
	this.retryCount = 3;
	this.timeout = 5000;
	this.paused = false;
};

AjaxQueue.prototype.queue = function(opts) {
	this._queue.push(opts);
};

AjaxQueue.prototype.dequeue = function() {
	this._queue.pop();
};

AjaxQueue.prototype.flush = function() {
	var
		that = this;

	this._queue.forEach(function(opts) {
		var
			success = opts.success,
			error = opts.error,

			_success,
			_error,
			request,
			xhr = $.ajax.bind($);

		that.currentRetry = 0;

		if (that.paused) {
			that.paused = false;
			return;
		}

		_success = function(data) {
			success(data);
		};

		_error = function(err) {
			if (that.currentRetry < that.retryCount) {
				that.currentRetry++;
				request();
			}

			error(err);
		};

		opts.success = _success;
		opts.error = _error;

		request = function() {
			setTimeout(function() {
				xhr(opts);
			}, that.timeout);
		};

		request();
	});
};

AjaxQueue.prototype.clear = function() {
	this._queue = [];
};

AjaxQueue.prototype.pause = function() {
	this.paused = true;
};