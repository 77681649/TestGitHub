;(function() {
	if (window.WebViewJavascriptBridge) { return; }


	var 
		/**
		 * @description 
		 * @type {HTMLIFrameElement}
		 */
		messagingIframe,

		/**
		 * @description 
		 * @type {}
		 */
		sendMessageQueue = [],

		/**
		 * @description 
		 * @type {}
		 */
		receiveMessageQueue = [],

		/**
		 * @description 
		 * @type {}
		 */
		messageHandlers = {},
		
		/**
		 * @description 
		 * @type {}
		 */
		CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme',

		/**
		 * @description 
		 * @type {}
		 */
		QUEUE_HAS_MESSAGE = '__WVJB_QUEUE_MESSAGE__',
		
		/**
		 * @description 
		 * @type {}
		 */
		responseCallbacks = {},

		/**
		 * @description 
		 * @type {}
		 */
		uniqueId = 1;
	
	/**
	 * @description 创建iFrame（用于存储准备发送的消息）
	 * @param  {HTMLDocument} doc document
	 */
	function _createQueueReadyIframe(doc) {
		messagingIframe = doc.createElement('iframe');
		messagingIframe.style.display = 'none';
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
		
		doc.documentElement.appendChild(messagingIframe);
	}

	/**
	 * @description 
	 * @param  {} messageHandler 
	 */
	function init(messageHandler) {
		if (WebViewJavascriptBridge._messageHandler) { throw new Error('WebViewJavascriptBridge.init called twice') }
		WebViewJavascriptBridge._messageHandler = messageHandler
		var receivedMessages = receiveMessageQueue
		receiveMessageQueue = null
		for (var i=0; i<receivedMessages.length; i++) {
			_dispatchMessageFromObjC(receivedMessages[i])
		}
	}

	/**
	 * @description 
	 * @param  {[type]} data             [description]
	 * @param  {[type]} responseCallback [description]
	 * @return {[type]}                  [description]
	 */
	function send(data, responseCallback) {
		_doSend({ data:data }, responseCallback)
	}
	
	/**
	 * @description 
	 * @param  {[type]} handlerName [description]
	 * @param  {[type]} handler     [description]
	 * @return {[type]}             [description]
	 */
	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler
	}
	
	/**
	 * @description 
	 * @param  {[type]} handlerName      [description]
	 * @param  {[type]} data             [description]
	 * @param  {[type]} responseCallback [description]
	 * @return {[type]}                  [description]
	 */
	function callHandler(handlerName, data, responseCallback) {
		_doSend({ handlerName:handlerName, data:data }, responseCallback)
	}
	
	/**
	 * @description 
	 * @param  {[type]} message          [description]
	 * @param  {[type]} responseCallback [description]
	 * @return {[type]}                  [description]
	 */
	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime()
			responseCallbacks[callbackId] = responseCallback
			message['callbackId'] = callbackId
		}
		sendMessageQueue.push(message)
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE
	}

	/**
	 * @description 
	 * @return {[type]} [description]
	 */
	function _fetchQueue() {
		var 
			messageQueueString = JSON.stringify(sendMessageQueue);
		
		sendMessageQueue = [];

		return messageQueueString;
	}

	/**
	 * @description 
	 * @param  {[type]} messageJSON [description]
	 */
	function _dispatchMessageFromObjC(messageJSON) {
		setTimeout(function _timeoutDispatchMessageFromObjC() {
			var message = JSON.parse(messageJSON)
			var messageHandler
			var responseCallback

			if (message.responseId) {
				responseCallback = responseCallbacks[message.responseId]
				if (!responseCallback) { return; }
				responseCallback(message.responseData)
				delete responseCallbacks[message.responseId]
			} else {
				if (message.callbackId) {
					var callbackResponseId = message.callbackId
					responseCallback = function(responseData) {
						_doSend({ responseId:callbackResponseId, responseData:responseData })
					}
				}
				
				var handler = WebViewJavascriptBridge._messageHandler
				if (message.handlerName) {
					handler = messageHandlers[message.handlerName]
				}
				
				try {
					handler(message.data, responseCallback)
				} catch(exception) {
					if (typeof console != 'undefined') {
						console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception)
					}
				}
			}
		})
	}
	
	/**
	 * @description 
	 * @param  {} messageJSON 
	 */
	function _handleMessageFromObjC(messageJSON) {
		if (receiveMessageQueue) {
			receiveMessageQueue.push(messageJSON)
		} else {
			_dispatchMessageFromObjC(messageJSON)
		}
	}

	/**
	 * @description 
	 * @type {Object}
	 */
	window.WebViewJavascriptBridge = {
		init: init,
		send: send,
		registerHandler: registerHandler,
		callHandler: callHandler,
		_fetchQueue: _fetchQueue,
		_handleMessageFromObjC: _handleMessageFromObjC
	};

	var 
		doc = document,
		readyEvent;

	_createQueueReadyIframe(doc);
	
	// 创建新的Events对象
	readyEvent = doc.createEvent('Events');

	// 初始化新事件对象的属性
	readyEvent.initEvent('WebViewJavascriptBridgeReady');

	// bridge
	readyEvent.bridge = WebViewJavascriptBridge;

	// 触发 WebViewJavascriptBridgeReady事件
	doc.dispatchEvent(readyEvent);
})();
