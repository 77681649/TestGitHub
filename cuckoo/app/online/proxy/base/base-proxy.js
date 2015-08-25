/**
 * 数据访问层代理基类
 * @author 王骁(wangxiao@ctrip.com)
 * @create 2015.08.25
 */

var
  util = require('util'),
  EventEmitter = require('events').EventEmitter,

  customUtils = require('../../lib/utils'),
  config = require('../../config'),
  ConnectionPool = utils.loadLibModule('connection-pool'),

module.exports = BaseProxy;

/**
 * 数据访问层代理基类
 * @constructor
 */
function BaseProxy(){
  this.pool = ConnectionPool.getInstance(
    ConnectionPool.databaseType.mysql,
    config.poolConfig
  );
}

/**
 * 执行select
 */
BaseProxy.prototype.select = function(sql , value , callback){

};

/**
 * 执行insert
 */
BaseProxy.prototype.insert = function(sql , value , callback){

};

/**
 * 执行update
 */
BaseProxy.prototype.update = function(sql , value , callback){

};

/**
 * 执行delete
 */
BaseProxy.prototype.delete = function(sql , value , callback){

};

/**
 * 执行SQL
 */
BaseProxy.prototype.query = function(sql , value , callback){
  this.pool.query(sql , value , callback);
};
