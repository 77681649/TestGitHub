/*!
 * 数据报文
 * @author 王骁(wangxiao@ctrip.com)
 * create on 2015.08.23
 */

var
  _ = require('underscore'),

  DATAGRAM_PROTOCOL = 'cuckoo:/',
  DATAGRAM_HEAD_LENGTH = 64,
  CHARSET_ENCODING = 'utf8',

  datagram = {};

module.exports = datagram;

/**
 * @description 创建数据报文
 * @param   {Number} tag  标识
 * @param   {String} data 数据
 * @param   {String} [encoding] 字符编码,default = utf=8
 * @return  {Buffer}
 */
datagram.create = function(tag , data , encoding){
  var
    headBuf,
    dataBuf,
    datagramBuf;

  encoding = encoding || CHARSET_ENCODING;

  try{
    dataBuf = new Buffer(data , encoding);
    headBuf = createDatagramHead(tag , dataBuf.length);
    datagramBuf = Buffer.concat([headBuf , dataBuf]);
  }
  catch(ex){
    throw ex;
  }

  return datagramBuf;
};

/**
 * 解析报文头
 * @param  {Buffer} buf
 * @return {Object} {
 *  protocl : 协议
 *  tag : 标识，用于标识执行动作
 *  length : 数据的字节数
 * }
 */
datagram.parseHeader = function(buf){
  var
    header = null,
    protocol,
    tag,
    length,
    offset = 0;

  if(buf instanceof Buffer && buf.length >= DATAGRAM_HEAD_LENGTH){
    // protocol
    protocol = buf.toString(CHARSET_ENCODING , offset , DATAGRAM_PROTOCOL.length);
    offset += DATAGRAM_PROTOCOL.length;

    // tag
    tag  = buf.readInt16LE(offset);
    offset += 16;

    // length
    length = buf.readInt32LE(offset);
    offset += 32;

    header = {
      protocol : protocol,
      tag : tag,
      length : length
    }
  }

  return header;
};

/**
 *
 */
datagram.getDataString = function(buffer , encoding){
  return this.getDataBuffer(buffer).toString(encoding || CHARSET_ENCODING);
};

/**
 *
 */
datagram.getDataBuffer = function(buffer){
  _.isArray(buffer) && (buffer = Buffer.concat(buffer));
  return buffer.slice(DATAGRAM_HEAD_LENGTH , buffer.length);
};

datagram.isValid = function(bufferLength , head){
  return bufferLength === head.length + DATAGRAM_HEAD_LENGTH;
};

/**
 * 创建报文头 - 64位(4字节)
 * 报文头的长度为DATAGRAM_HEAD_LENGTH , 报文头数据不够长度时在尾部补0
 *
 * @param  {Number} tag 标识
 * @param  {Number} length 数据长度
 * @return {Buffer} 64位的报文头
 */
function createDatagramHead(tag , length){
  var
    buf = new Buffer(DATAGRAM_HEAD_LENGTH),
    offset = 0;

  // protocol 8位
  buf.write(
    DATAGRAM_PROTOCOL ,
    offset ,
    DATAGRAM_PROTOCOL.length ,
    CHARSET_ENCODING);
  offset += DATAGRAM_PROTOCOL.length;

  // tag 16位
  buf.writeInt16LE(tag, offset);
  offset += 16;

  // data length 32位
  buf.writeInt32LE(length , offset);
  offset += 32;

  // 尾部补8位的0
  buf.writeInt8(0 , offset);

  return buf;
}
