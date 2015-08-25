/**
 * 数据访问层代理基类
 * @author 王骁(wangxiao@ctrip.com)
 * @create 2015.08.25
 */

var
  util = require('util'),
  BaseProxy = require('./base/base-proxy');

function AppInit(){

}

/**
 * 插入数据
 */
AppInit.prototype.insert(insert , callback){
  this.query(sql , value , callback);
}
