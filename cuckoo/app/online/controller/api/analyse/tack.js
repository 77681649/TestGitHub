/**
 * @description 订单信息 Model
 * @author 王骁(wangxiao@ctrip.com) 
 * @create 2015.08.20
 */

'use strict';

module.exports = {

	/**
	 * @description 写入 - 访问记录
	 * @type {Object}
	 */
	saveTrack: {
		get: {
			url : '',
			callback:function(req, res) {
				res.end('ok');
			}
		}
	},

	/**
	 * @description 根据时间获得"访问记录"的数量
	 * @param  {Date}   startTime 开始时间
	 * @param  {Date}   endTime   结束时间
	 */
	getTrackCountByTime: function(startTime, endTime) {

	},

	/**
	 * @description 根据时间获得"访问记录"
	 * @param  {Number} pageIndex 当前页号
	 * @param  {Number} pageSize  每页大小
	 * @param  {Date}   startTime 开始时间
	 * @param  {Date}   endTime   结束时间
	 */
	getTrackByTime: function(pageIndex, pageSize, startTime, endTime) {

	}
};