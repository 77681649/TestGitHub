/**
 * 通用工具类
 * @author 王骁(wangxiao@ctrip.com)
 * @create 2015.08.25
 */

/**
 * 加载cuckoo各个系统公用的模块
 * (统一引用点，防止以后该了lib的路径，需要改多个地方)
 * @return {Object} 返回加载到的模块
 */
exports.loadLibModule = function(name){
  return require('../lib/' + name);
}
