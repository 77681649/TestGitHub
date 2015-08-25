var
  _ = require('underscore'),
  Server = require('./server'),
  datagram = require('../lib/datagram'),
  datagramTag = require('../lib/datagram-tag'),
  server,
  port = 8888;

function start(){
  server = new Server({
    port : port
  });

  server.on('data', onData);
  server.start();
}

function onData(chuck , socket){
  var
    chucks = socket.chucks

  // 解析出heade
  if(socket.firstChuck){
    socket.datagramHead = datagram.parseHeader(chuck);
    socket.firstChuck = false;
  }

  socket.chucks.push(chuck);

  var
    head = socket.datagramHead,
    receipted = getBuffersLength(chucks);

  if(datagram.isValid(receipted,head)){
    var
      data = datagram.getDataString(chucks);

    dispatcher(head.tag , data , function callback(err , tag , result){
      if(err){

      }

      var
        buf = datagram.create(tag , JSON.stringify(result));

      socket.end(buf);
    });
  }
}

function getBuffersLength(buffers){
  var length = 0;

  _.each(buffers , function(buf){
    length += buf.length;
  });

  return length;
}

function dispatcher(tag , data , callback){
  var tags = datagramTag;

  switch (tag) {
    case tags.GET_PAGEVIEW_COUNT_BY_TIME:
      process.nextTick(function(){
        var result = {
          errcode:0,
          data :{
            count : 2
          }
        };

        callback(null ,tag , result);
      });
      break;

    case tags.GET_PAGEVIEW_DATA_BY_TIME:
      process.nextTick(function(){
        var result = {
          errcode:0,
          data :{
            pageview : [
              {id:1,count:10},
              {id:2,count:100}
            ]
          }
        };

        callback(null ,tag , result);
      });
      break;

    case tags.GET_ORDER_INFO_COUNT_BY_TIME:
      process.nextTick(function(){
        var result = {
          errcode:0,
          data :{
            count : 3
          }
        };

        callback(null ,tag , result);
      });
      break;

    case tags.GET_ORDER_INFO_DATA_BY_TIME:
      process.nextTick(function(){
        var result = {
          errcode:0,
          data :{
            pageview : [
              {id:1,count:10},
              {id:2,count:100},
              {id:3,count:1000}
            ]
          }
        };

        callback(null ,tag , result);
      });
      break;

    default:
      process.nextTick(function(){
        callback(null , tag , {});
      });
  }
}

function close(){
  server && server.close();
}

// start
start();
