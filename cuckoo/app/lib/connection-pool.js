/**
 * 数据库连接池 - 封装node-mysql连接池功能
 * @author 王骁(wangxiao@ctrip.com) 
 * @create 2015.08.21
 */
var
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

module.exports = ConnectionPool;

var
	_connectionPool;

// 继承 - 事件触发器
util.inherits(ConnectionPool, EventEmitter);

/**
 * 连接池
 * @constructor
 */
function ConnectionPool() {
	EventEmitter.call(this);
}

/**
 * 数据类型
 * @type {Object}
 */
ConnectionPool.databaseType = {
	mysql: 'mysql'
};

/**
 * 获得一个连接池实例
 * @param  {String} databaseType 数据库类型
 * @param  {Object} poolCfg 连接池配置
 * @return {ConnectionPool}
 */
ConnectionPool.getInstance = function(databaseType, poolCfg) {
	if (!_connectionPool) {
		_connectionPool = _createFactory();
	}

	return _connectionPool;
};

/**
 * 创建一个连接池
 * @param  {String} databaseType 数据库类型
 * @param  {Object} poolCfg 连接池配置
 * @return {ConnectionPool}
 */
function _createFactory(databaseType, poolCfg) {
	var
		types = ConnectionPool.databaseType,
		pool;

	switch (databaseType) {
		case types.mysql:
			pool = new require('./mysql-connection-pool')(poolCfg);
			break;
		default:
			new Error('databaseType is error.');
			break;
	}

	return pool;
}