var
  net = require('net'),
  _ = require('underscore'),
  datagram = require('./lib/datagram'),
  client,
  tag = 0,
  data = (function(){
    var
      tmp = [],
      size = 100 * 1024;

    for(var i = 0;i<size;i++){
      tmp.push('A');
    }

    return tmp.join('');
  })();

function connect(port , host){
  client = net.connect(port , host , onConnect);
  // client.setNoDelay(true);
  client.on('data' , onData);
  client.on('error' , onError);
  client.on('tiemout' , onTimeout);
  client.on('drain' , onDrain);
  client.on('end',onEnd);

  client.firstChuck = true;
  client.chucks = [];
  client.datagramHead = null;
}

function getMe(){
  var
    data = 'hello world zzz';
    buf = datagram.create(tag,data);

  client.end(buf);
}

function onConnect(){
  console.log('connected to [%s:%s]' , client.remoteAddress , client.remotePort);

  // console.log('write data to server [%dKB] [drain:%s]' ,
  //   Math.round(data.length / 1024),
  //   client.write(data));


  getMe();
}


function onData(chuck){
  console.log('from server data [%dB] ' , Math.ceil(chuck.length ));
  // console.log(chuck.toString());

  var
    chucks = client.chucks

  // 解析出heade
  if(client.firstChuck){
    client.datagramHead = datagram.parseHeader(chuck);
    client.firstChuck = false;
  }

  client.chucks.push(chuck);

  var
    head = client.datagramHead,
    receipted = getBuffersLength(chucks);

  if(datagram.isValid(receipted,head)){
    var
      data = datagram.getDataString(chucks);

    console.log('-------------------------------- from server [%s]:' , head.tag);
    console.log(data);
  }
}

function getBuffersLength(buffers){
  var length = 0;

  _.each(buffers , function(buf){
    length += buf.length;
  });

  return length;
}

var
  t= 0;

function onEnd(){
  console.log('client is end.');
}

function onDrain(){
  console.log('drain');
}

function onTimeout(){
  console.log('timeout');
}

function onClose(){
  console.log('server is closed.');
}

function onError(err){
  // 服务器发生错误
  console.log('error %j' , err);
}

process.on('message',function(message){
  tag = parseInt(message);
  connect(6666);
})
