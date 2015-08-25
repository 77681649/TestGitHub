/**
 * @description 路由器
 * @author 王骁(wangxiao@ctrip.com) 
 * @create 2015.08.19
 */

var
	fs = require('fs'),
	path = require('path'),

	_ = require('underscore'),


	/**
	 * @description 路由选择器
	 * @type {Object}
	 */
	router = {
		routes: null,
	},

	methods = {
		'get': 'get',
		'post': 'post',
		'put': 'put',
		'delete': 'delete',
		'option': 'option',
		'trace': 'trace'
	};

module.exports = exports = router;

/**
 * @description 将自定义配置的路由注入到Express APP
 * @param  {Express.Application} express app
 */
router.inject = function(app) {
	if (!_.isObject(app)) {
		throw new Error('inject error , app is invald.');
	}

	// 配置自定义的路由规则
	// HACK:最好剥离router
};

/**
 * @description 注入controller的路由规则
 * @param  {Object} app  express app
 * @param  {Object} root 根路径
 */
router.injectControllerRoute = function(app, root) {
	if (!_.isObject(app)) {
		throw new Error('inject error , app is invald.');
	}

	root = root || 'controller';
	this.routes = this.routes || generateControllerRoute(root);

	injectRoute(app, this.routes);
};



/**
 * @description 生成Controller的路由规则
 * @param  {String} root 根目录
 */
function generateControllerRoute(root) {
	var
		routes = [];

	readdirSync(root, function(modulePath) {

		// 仅解析js文件
		if (!isJavascript(modulePath)) {
			return;
		}

		var
			controller = loadModule(modulePath),
			baseUrl = generateBaseUrl(root, modulePath);

		_.each(controller, function(action, actionName) {
			// 仅解析有效的Action
			if (isValidAction(action)) {
				var
					url,
					defaultUrl = baseUrl + '/' + actionName,
					callback;

				_.each(action, function(prop , method) {
					if(!_.isFunction(prop)){
						url = prop.url;

						if(_.isString(url)){
							!path.isAbsolute(prop) && 
								(url = baseUrl + '/' + url);
						}
						else{
							url = defaultUrl;
						}

						callback = prop.callback;
					}
					else{
						url = defaultUrl;
						callback = prop;
					}

					if (isValidMethod(method)) {
						routes.push(generateRoute(url, method, callback));
					}
				});
			}
		});
	});

	console.log(routes);

	return routes;
}

/**
 * @description 加载模块
 * @param  {String} path 模块路径
 * @return {Object}
 */
function loadModule(path) {
	return require('./' + path);
}

/**
 * @description 根据模块路径生产根URL
 * @param  {String} modulePath 根据模块路径
 * @return {String}
 *
 * @example
 * modulePath = './controller/api/index.js'
 * generateBaseUrl(modulePath) // return 'api/index'
 */
function generateBaseUrl(root, modulePath) {
	var
		baseUrl = modulePath,
		extname = path.extname(baseUrl);

	baseUrl = baseUrl.replace(root, '');
	extname && (baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(extname)));

	return baseUrl;
}

/**
 * @description 
 * @param  {String} url    路径
 * @param  {String} verb   HTTP verb
 * @param  {Function} callback 回调函数
 * @return {Object}
 */
function generateRoute(url, verb, callback) {
	return {
		url: url,
		method: verb,
		callback: callback
	};
}

/**
 * @description 将路由注入到express app
 * @param  {Array} routes
 */
function injectRoute(app, routes) {
	_.each(routes, function(route) {
		app[route.method](route.url, route.callback);
	});
}

/**
 * @description 判断是否是Javascript模块
 * @param  {String}  modulePath 模块路径
 * @return {Boolean} true,是
 */
function isJavascript(modulePath) {
	return path.extname(modulePath) === '.js';
}

/**
 * @description 判断是否是有效的Action
 * 在Controller中有效的Action应该是一个key-value（不是函数也不是数组）
 * 
 * @param  {Object}  action 
 * @return {Boolean} true,是
 */
function isValidAction(action) {
	return _.isObject(action) &&
		!_.isFunction(action) &&
		!_.isArray(action);
}

/**
 * @description 判断methodName方法是否是有效的
 * @param  {Object} methodName Http method
 * @return {Array}
 */
function isValidMethod(methodName) {
	return !!methods[methodName.toLowerCase()];
}

/**
 * @description 遍历读取指定根路径下的所有目录
 *
 * 同步的情况下回抛出异常，这里不处理
 * （因为读取controller目录必须完成）
 * 
 * @param  {String} root         根路径
 * @param  {Function} fileHandle 当遍历到是文件时的处理函数
 */
function readdirSync(root, fileHandle) {
	var
		files = fs.readdirSync(root);

	_.each(files, function(file) {
		var
			p = root + '/' + file,
			stat = fs.statSync(p);

		if (stat && stat.isDirectory()) {
			readdirSync(p, fileHandle);
		} else {
			fileHandle(p);
		}
	});
}