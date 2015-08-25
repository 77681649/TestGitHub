/**
 * @description 种子文件
 * @author 王骁(wangxiao@ctrip.com) 
 * @create 2015.08.19
 */

'use strict';

var
/*
 * system
 */
	path = require('path'),



	/*
	 * third party
	 */
	express = require('express'),

	/**
	 * @description express中间件 - 解析favicon
	 * @type {Object}
	 */
	favicon = require('serve-favicon'),

	/**
	 * @description express中间件 - 日志工具
	 * @type {Object}
	 */
	logger = require('morgan'),

	/**
	 * @description express中间件 - 
	 * @type {Object}
	 */
	methodOverride = require('method-override'),

	/**
	 * @description express中间件 - 支持session (req.session)
	 * @type {Object}
	 */
	session = require('express-session'),

	/**
	 * @description express中间件 - 支持解析JSON,urlencode,multipart requests类型的请求体
	 * @type {[type]}
	 */
	bodyParser = require('body-parser'),

	/**
	 * @description express中间件 - 支持解析multipart/form-data类型的请求体 , 用于上传文件
	 * @type {Object}
	 */
	multer = require('multer'),

	/**
	 * @description express中间件 - 支持解析multipart/form-data类型的请求体 , 用于上传文件
	 * @type {Object}
	 */
	cookie = require('cookie-parser'),

	/**
	 * @description express中间件 - 
	 * @type {Object}
	 */
	errorHandler = require('errorhandler'),



	/**
	 * @description 配置文件
	 * @type {Object}
	 */
	config = require('./config'),

	/**
	 * @description 路由
	 * @type {Object}
	 */
	router = require('./router'),

	app = express(),
	port,

	defaultCfg = {
		port: 3000
	};

/*
 * 配置APP
 */
port = config.port || defaultCfg.port;

app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

require('./../sync/server.js')

/*
 * 注册中间件
 */

// app.use(favicon(__dirname + '/public/favicon.ico'));

// 日志
app.use(logger('dev'));

// 
// app.use(methodOverride());

// 支持session
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'uwotm8'
}));
// 用于解析 json
app.use(bodyParser.json());

// 用于解析 urlencoed
app.use(bodyParser.urlencoded({
	extended: true
}));

// 用于解析 multipart/form-data
// app.use(multer());

// 用于解析 静态文件
// app.use(express.static(path.join(__dirname, 'public')));

var
	pool = require('../lib/mysql-connection-pool');

console.log(pool)

/*
 * 注册路由
 */

// 设置支持跨域请求
// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });
// 
router.inject(app);
router.injectControllerRoute(app);

/*
 * 启动服务器
 */
app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});