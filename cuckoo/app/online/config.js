/**
 * @description 配置文件
 * @author 王骁(wangxiao@ctrip.com)
 * @create 2015.08.19
 */

'use strict';

var
	cfg = {
		/**
		 * @description 环境 dev | test | uat | product
		 * @type {String}
		 */
		env : 'dev',

		/**
		 * @description 版本号
		 * @type {String}
		 */
		version : '1.0.0',

		/**
		 * @description 端口号
		 * @type {Number}
		 */
		port : 3000 ,

		/**
		 * 数据库连接池
		 * @type {Object}
		 */
		poolConfig :{
			/**
			 * 连接对象使用的超时时间
			 */
			acquireTimeout:100 * 1000,

			/**
			 * 连接池中最多的连接数
			 */
			connectionLimit:1000,

			/**
			 * 连接池中等待请求队列中的最大等待数
			 */
			queueLimit:1000
		},

		__cover__:{
			product : {
				port : 80
			}
		}
	};



/**
 * @description 解析配置
 * @param  {Object} cfg 配置
 * @return {Object}
 */
function parse(cfg){
	var
		env = cfg.env || 'debug',
		cover = cfg.__cover__ || {};

	cover = cover[env] || {};

	delete cfg.env;
	delete cfg.__cover__;

	for(var prop in cover){
		cfg[prop] = cover[prop];
	}

	return cfg;
}

module.exports = parse(cfg);
