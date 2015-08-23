/*!
 * 服务器端
 * @author 王骁(wangxiao@ctrip.com)
 * create on 2015.08.22
 */
var
  net = require('net'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,

  datagram = require('./lib/datagram');

module.exports = Server;

util.inherits(Server , EventEmitter);
function Server(options){
  EventEmitter.call(this);

  this.options = options || {};
  this.port = options.port || 6543;
  this.timeout = options.timeout || (10 * 60 * 1000);
  this.server;
  // this.connections = [];
}

/**
 * 启动服务器
 */
Server.prototype.start = function(){
  try
  {
    var
      server = this.server = net.createServer(this.options),
      port = this.port;

    server.on('connection',onConnection.bind(this));
    server.on('close',onClose.bind(this))
    server.on('error',onServerError.bind(this));

    server.listen(port, onListening.bind(this));
  }
  catch(ex){
    this.emit('serverErr', {
      code : 'ESTARTERROR',
      ex : ex
    });
  }
};

/**
 * 关闭服务器
 */
Server.prototype.close = function(){
  var
    server = this.server;

  try
  {
    server && server.close();
  }
  catch(ex){
    this.emit('serverErr', {
      code : 'ECLOSEERROR',
      ex : ex
    });
  }
};

/**
 * 发送数据
 */
Server.prototype.send = function(socket , tag , data , encoding){
  try{
    var buf = datagram.create(tag , data , encoding);
    socket.write(buf);
  }
  catch(ex){
    this.emit('serverErr', {
      code : 'ESENDERROR',
      ex : ex
    });
  }
}

/**
 * 监听成功时触发
 */
function onListening(){
  console.log("opened server on %j", this.server.address());
  this.emit('listen');
}

/**
 * 当有新的连接时触发
 * @param {net.Socket} 用于新连接的套接字
 */
function onConnection(socket){
  var
    _onData = function(chuck){
      onData.call(this , chuck , socket );
    },
    _onTimeout = function(){
      onTimeout.call(this,socket);
    },
    _onDrain = function(){
      onDrain.call(this , socket);
    },
    _onEnd = function(){
      onEnd.call(this , socket);
    },
    _onError = function(err){
      onError.call(this , err , socket);
    };

  console.log('NEW CONNECT : [%s:%s]' ,
    socket.remoteAddress ,
    socket.remotePort);

  socket.firstChuck = true;
  socket.chucks = [];
  socket.datagramHead = null;

  socket.setTimeout(server.timeout , _onTimeout.bind(this));
  socket.on('data' , _onData.bind(this));
  socket.on('error' , _onError.bind(this));
  socket.on('end', _onEnd.bind(this));
  socket.on('drain' , _onDrain.bind(this));
}

/**
 * 有数据到达时触发
 * @param {net.Socket} socket 当前连接使用的socket
 * @param {Buffer} 数据块
 */
function onData(chuck , socket){
  console.log('NEW DATA CHUCK : [%s:%s , length : %sB]',
    socket.remoteAddress,
    socket.remotePort,
    Math.ceil(chuck.length)
  );

  this.emit('data' , chuck , socket);
}

/**
 * 当写入缓冲区清空时触发
 */
function onDrain(socket){
  console.log('drain');
  socket.end();
  this.emit('drain');
}

/**
 * 当连接超时时触发
 */
function onTimeout(socket){
  console.log('timeout');
  socket.end();
  this.emit('tiemout');
}

/**
 * 当连接结束时触发
 */
function onEnd(socket){
  console.log('connection is end.');
  this.emit('end' , socket);
}

/**
 * 当连接关闭时触发
 */
function onClose(){
  console.log('server is closed.');
  this.emit('close');
  delete this;
}

/**
 * 服务器发生错误
 * @param {Error} err
 */
function onServerError(err){
  console.log('error server %j' , err);
  this.emit('serverError' , err);
}

/**
 * 连接过程中发生错误
 * @param {Error} err
 */
function onError(err , socket){
  console.log('connect error %j' , err);
  socket.destroy();
  socket = null;
  this.emit('connectError' , err);
}
//
// var
//   start = new Date().getTime();
//
// console.log('start init data');
// initData();
// console.log('init data time %s [data length : %sMB] [data size : %sMB]' ,
//   (new Date().getTime() - start) / 1000,
//   data.length / 1024 / 1024,
//   new Buffer(data).length / 1024 / 1024
// );
//
// console.log('heapTotal : %dMB' , process.memoryUsage().heapTotal / 1024 / 1024)
// console.log('heapUsed : %dMB' , process.memoryUsage().heapUsed / 1024 / 1024)

// start server
var server = new Server({
  port:6666
});

server.on('serverErr',function(err){
  console.log(err);
})
