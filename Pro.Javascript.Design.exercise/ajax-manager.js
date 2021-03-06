/**
 * AjaxHandler - 专用型连接对象
 * 可以根据网络条件创建专门的请求对象
 *     1. Online
 *     2. Offline
 */
var AjaxHandler = new Interface('IAjaxHandler', ['createXhrObject', 'request']);

/**
 * @description 可以根据浏览器能力的不同生成一个XMLHttpRequest或ActiveXObject实例
 */
function SimpleAjaxHanlder() {

}

SimpleAjaxHanlder.prototype = {

    /**
     * @description 可以根据浏览器能力的不同生成一个XMLHttpRequest或ActiveXObject实例
     */
    createXhrObject: function() {
        var
            createXMLHttpRequet = function() {
                return new XMLHttpRequest();
            },

            createNewActiveXObj = function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },

            createOldActiveXObj = function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            },

            methods = [createXMLHttpRequet, createNewActiveXObj, createOldActiveXObj];

        for (var i = 0, len = methods.length; i < len; i++) {
            try {
                methods[i]();
            } catch (e) {
                continue;
            }

            // 使用Memoizing技术缓存XHR对象
            this.createXhrObject = methods[i];
            return methods[i]();
        }

        throw new Error('create XHR Object failed.');
    },

    /**
     * @description 负责执行发出请求和处理响应结果所需的一系列操作
     * @param  {Object} opts 请求参数
     */
    request: function(opts) {
        this._sendRequest(opts);
    },

    /**
     * @description 负责执行发出请求和处理响应结果所需的一系列操作
     * @param  {Object} opts 请求参数
     */
    _sendRequest: function(opts) {

        opts || (opts = {});

        var
            xhr = this.createXhrObject(),
            method = opts.type || 'get',
            url = opts.url,
            success = opts.success || function() {},
            error = opts.error || function() {};

        xhr.onreadystatechange = function() {
            if (xhr.status === 200) {
                if (xhr.readyState === 4) {
                    success(xhr.responseText);
                    return;
                }
            }
        };

        xhr.onerror = function() {
            error();
        }

        xhr.open(method, url, true);
        xhr.send(opts.data || null);
    }
};

/**
 * @description 在发起新的请求之前先确保所有请求都已经成功处理
 * 如果没有正常处理，则执行重试
 */
function QueueAjaxHandler() {
    this.queue = [];
    this.retryDelay = 5;
    this.requestInProgress = false;
}

Object.extend(QueueAjaxHandler, SimpleAjaxHanlder);

QueueAjaxHandler.prototype.request = function(opts) {
    opts || (opts = {});

    if (this.requestInProgress && !opts.override) {
        opts.needRetryDelay = 1;
        this.queue.push(opts);
    } else {
        this.requestInProgress = true;

        var
            success = opts.success,
            error = opts.error,
            retryDelay = this.retryDelay * 1000,
            that = this;

        opts.success = function(data) {
            success(data);
            that.advanceQueue();
        };

        opts.error = function() {
            error();

            if(opts.needRetryDelay > 0){
                setTimeout(function() {
                    opts.needRetryDelay--;
                    that.request(opts);
                }, retryDelay);
            }
            else{
                that.advanceQueue();
            }
        }

        this._sendRequest(opts);
    }
};

QueueAjaxHandler.prototype.advanceQueue = function(){
    if(this.queue.length === 0){
        this.requestInProgress = false;
        return;
    }

    var
        opts = this.queue.shift();

    opts.override = true;

    this.request(opts);
};

/**
 * @description 在用户处于离线状态时把请求缓存起来
 */
function OfflineAjaxHandler() {
    this.storedRequests = [];
}


Object.extend(OfflineAjaxHandler, SimpleAjaxHanlder);

/**
 * @description 请求
 * 用户离线 —— 缓存请求
 * 用户在线 —— 发起请求，并将缓存的请求全部发出
 */
OfflineAjaxHandler.prototype.request = function(opts){

    if(AjaxManager.isOffline()){
        // 离线
        this.storedRequests.push(opts);
    }
    else{
        // 在线
        this.flushStoredRequests();
        this._sendRequest(opts);
    }
};

OfflineAjaxHandler.prototype.flushStoredRequests = function(){
    for(var i = 0 , len = this.storedRequests.length ; i < len ; i++ ){
        this._sendRequest(this.storedRequests[i]);
    }
};

/**
 * @description 根据网络环境创建不同的Ajax处理对象
 */
var AjaxManager = {
    isOffline : function(){
        return false;
    },

    isHighLatency : function(){
        return false;
    },

    createAjaxHandler: function() {
        var
            xhr;

        if(this.isOffline()){
            xhr = new OfflineAjaxHandler();
        }
        else if(this.isHighLatency()){
            xhr = new QueueAjaxHandler();
        }
        else {
            xhr = new SimpleAjaxHanlder();
        }

        return xhr;
    }
};