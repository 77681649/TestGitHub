/**
 * RSS阅读器
 * config - 用于配置RSS的参数（url , updateInterval , id ,parent）
 * AjaxHandler - 用于处理Ajax请求
 * Display - 用于显示RSS内容
 * FeedReader - 用于获取、解析、显示RSS
 *     fetch - AJAX读取内容
 *     parse - 解析内容
 *     start / end - 自动更新
 *
 * FeedReaderManager - 用于拼装Display , AjaxHandler , FeedReader 的工厂
 */


var rssManager = {
     createFeedReader : function(conf){
          var
               displayHandler = new rssDisplayInListHandler(),
               ajaxHandler = AjaxManager.createAjaxHandler();

          return new FeedReader(conf , displayHandler , ajaxHandler);
     }
};

function FeedReader(conf , displayHandler , ajaxHandler){
     this.displayHandler = displayHandler;
     this.ajaxHandler = ajaxHandler;

     this.url = conf.url;

     this.start();
}

FeedReader.prototype = {
     fetch : function(){
          var
               that = this,
               opts = {
                    url : this.url,
                    success : function(data){
                         that.parse(data);
                    },
                    error : function(){
                         console.log('error');
                    }
               };

          this.ajaxHandler.request(opts);
     },

     parse : function(data){
          console.log(data);
     },

     start : function(){
          this.fetch();
     },

     end : function(){

     }
};


function rssDisplayInListHandler(){

}