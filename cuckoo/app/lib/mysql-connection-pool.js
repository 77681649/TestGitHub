/**
 * mysql数据库连接池 - 封装node-mysql连接池功能
 * @author 王骁(wangxiao@ctrip.com)
 * @create 2015.08.21
 */

var
	util = require('util'),

	_ = require('underscore'),
	mysql = require('mysql'),
	async = require('async'),

	ConnectionPool = require('./connection-pool');

module.exports = MysqlConnectionPool;


// 继承 - ConnectionPool
util.inherits(MysqlConnectionPool, ConnectionPool);

/**
 * Mysql 连接池
 * @constructor
 */
function MysqlConnectionPool(options) {
	this._pool;
	this._init(options);
}

/**
 * 初始化Pool
 * @param  {Object} options 参数
 */
MysqlConnectionPool.prototype._init = function(options) {
	var pool = this._pool;

	if (pool) {
		// 禁止重复初始化
		return;
	}

	// 创建一个pool
	pool = mysql.createPool(options);
};

/**
 * 执行数据库查询 - 从Pool中取出一个连接 , 使用该连接执行查询操作
 * @param  {*}   sql
 * @param  {}   values
 * @param  {Function} callback 回调函数
 * @return {Query}
 */
MysqlConnectionPool.prototype.query = function(sql, values, callback) {
	if (!this._pool) {
		throw Error('pool is null.');
	}

	return pool.query(sql , values , callback);
};

/**
 * 关闭 && 销毁连接池
 * @param  {Function} callback 回调函数
 */
MysqlConnectionPool.prototype.destroy = function(callback) {
	if (!this._pool) {
		throw Error('pool is null.');
	}

	var endPool = this._pool.end;

	function onEnd(err){
		var destory = destory(){
			this._pool = null;
			endPool = null;
			_.isFunction(callback) && callback(err);
		};

		if (err) {
			// 发生错误 , 重试3次
			async.retry(
				{times : 3},
				function task(){
					endPool()
				} ,
				destory);
		}

		destory();
	}

	endPool(onEnd);
};
