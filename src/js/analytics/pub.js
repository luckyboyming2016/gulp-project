/**
 * 为了提升产品品质，更好地为用户服务，我们想了解用户对哪些页面比较喜欢，那些页面觉得比较无趣.
 * @param context 上下文对象，一般是window
 */
(function(context){
	
	var pub = (context && context.pub) || (context.pub = {});
	if(pub.inited){
		console.warn('repeat invoke pub.js!');
	}
	pub.start = Date.now();
	pub.version = '0.2';
	pub.remote = 'http://bdata.mogoroom.com/';
	pub.test = 'http://192.168.60.212:82/';
	
	define(['jquery','analytics/bin','underscore','moment','URL','analytics/dict/page','jquery.cookie'],function($,Bin,_,moment,URL,pageDict){
		
		/**
		 * 网站分析有4个关键指标：PV、UV、VV、独立IP数。
		 * PV（浏览次数）：用户每打开一个网站页面，记录1个PV。用户多次打开同一页面PV累计多次。
		 * UV（独立访客）：一天内相同访客多次访问网站，只计算为一个独立访客。
		 * VV（访问次数）：记录所有的访客一天内访问了多少次你的网站，相同的访客有可能多次访问你的网站。
		 * 从访客来到网站到最终关闭网站的所有页面离开，计为一次访问。
		 * 若访客连续三十分钟没有新开和刷新页面，或者关闭了浏览器，则被计算为本次访问结束。
		 * 
		 * 独立IP数不作统计
		 */
		function Tracker(opt){
			opt = opt || {};
			this.bin = new Bin();
			if(opt.clipper){
				this.clipper = opt.clipper;
			}
			this.pvLogTick = opt.pvLogTick || 10;	//连接两次PV记录的最小时间间隔,单位秒数
			this.pageId = opt.pageId||this.getPageCode();		// pageId代表着页面编码,(准确来说实际是pageCode)
			this.baseInfo = this.buildBaseInfo();
			if(opt.context =='/mogoroom-renterpc'){	//在测试环境，切换远程地址
				pub.remote = pub.test;
			}
		}
		
		Tracker.prototype = {
			/**
			 * 一天中的毫秒数
			 */
			day:1000 * 60  * 60 * 24,
			/**
			 * 一小时的毫秒数
			 */
			hour: 1000 * 60 * 60,
			/**
			 * 获取以"yyyy-MM-dd"格式化后的日期
			 * @param milliseconds 代表指定日期的毫秒数。选填，默认为当前时间的毫秒数
			 * @returns {String} 格式化后的日期的字符串表示，比如 "2015-04-01"
			 */
			getFormattedDate:function( milliseconds ){
				var date = milliseconds==null? new Date(): new Date( milliseconds );
				var fix = function( it ){
					return it<10 ? '0'+it : String(it);
				};
				return date.getFullYear() + '-' + fix(date.getMonth()+1) + '-' + fix(date.getDate());
			},
			/**
			 * 每个页面需要分配一个页面编码。
			 * 但是分配以P_001,P_002这样的编码即冗余又不便于理解记忆。
			 * 故采用通过URI计算得出。
			 * 这个页面编码与location.hash,location.search,location.host,location.port等均无关，只与location.pathname相关。
			 * 通过如下几步对location.pathname处理得出页面编码：
			 * 1. 如果location.pathname附有JSESSIONID信息戳，抹掉它
			 * 2. pathname中以某种文件后缀名结束，去掉'.'和文件后缀名；
			 * 3. 若pathname中有可变部分，则只取pathname中的固定部分；
			 * 4. 如果得出的页面编码已被占用，替换成另外一个名字。
			 * 示例：
			 * http://www.mogoroom.com/index.shtml;jsessionid=9EB1D5F8D60BFB8D4BEE993E65811CA0-n2 处理后会的页面编码是 index
			 */
			getPageCode:function(uri){
				uri = uri || location.pathname;
				this.clipper.forEach( function(it){
					uri = (_.isFunction(it) ? it(uri) : uri.replace(it,'')) || uri;
				});
				return uri;
			},
			/**
			 * 尝试记录一次PV
			 * PV（浏览次数）：用户每打开一个网站页面，记录1个PV。用户多次打开同一页面PV累计多次。
			 * PV的记录可以失败，比如是因为频繁刷新（即和上次记录的时间间隔明显过短）
			 * @param arr
			 * @param milliseconds
			 */
			logPV:function(){
				var pv = this.bin.get('pv')||{};
				var now = Date.now();
				if(!pv[this.pageId]){//当前页面未有任何记录 
					pv[this.pageId] = [now,now];	//用一个数组记录某个页面的pv数据，数组中的第一项是不代表着一个PV，而是一个校验时间，代表着最新的记录时间
				}else{//当前页面已有记录
					if( now - pv[this.pageId][0] > this.pvLogTick * 1000){
						pv[this.pageId].push(now);
					}
					pv[this.pageId][0] = now;
				}
				this.bin.set('pv',pv);
			},
			/**
			 * 尝试记录一次UV
			 * UV（独立访客）：一天内相同访客多次访问网站，只计算为一个独立访客。
			 */
			logUV:function(){
				var uv = this.bin.get('uv');
				var date  = this.getFormattedDate();;
				if(!uv){	//当前客户端未有任何UV记录 
					uv = [date,date];
					this.bin.set('uv',uv);
				}else{
					if(uv[0] != date){
						uv.push(date);
						uv[0] = date;
						this.bin.set('uv',uv);
					}
				}
			},
			/**
			 * 尝试记录一次VV
			 * VV（访问次数）：记录所有的访客一天内访问了多少次你的网站，相同的访客有可能多次访问你的网站。
			 * 从访客来到网站到最终关闭网站的所有页面离开，计为一次访问。
			 * 若访客连续三十分钟没有新开和刷新页面，或者关闭了浏览器，则被计算为本次访问结束。
			 */
			updateVV:function(){
				var vv = this.bin.get('vv');
				var now = Date.now();
				if(!vv){	//当前客户端未有任何VV记录 
					vv = [now];
					this.bin.set('vv',vv);
				}else{
					var lastActive = this.bin.get('lastActive');
					if(now - lastActive > this.hour * 0.5){	//活跃时间大于半小时，添加一次访客次数
						vv.push(now);
						this.bin.set('vv',vv);
					}
				}
				this.bin.set('lastActive',now,true);
			},
			logClick:function(e){	//e这里是jQuery的事件对象
				this.atomLog(e,'click');
			},
			logEnter:function(e){
				this.atomLog(e,'enter');
			},
			atomLog:function(e,type){
				/*var name = e.data.name;
				if(_.isFunction(name)){
					name = name(e.target);
				}
				var data = this.bin.get(type)||{};
				var now = Date.now();
				if(!data[this.pageId]){
					data[this.pageId]={};
				}
				if(!data[this.pageId][name]){
					data[this.pageId][name] = [];
				}
				data[this.pageId][name].push(now);
				this.bin.set(type,data);
				this.updateVV();*/
				var datum = $.extend({
					logUrl:location.href,
					eventType:type,
					clientPosition:e.pageX+','+e.pageY,
					logTime:moment().format('YYYYMMDDhhmm'),
					eventCode:e.data.id
				},this.baseInfo);
				var log = this.bin.get('log')||[];
				log.push(datum);
				this.bin.set('log',log);
			},
			/**
			 * 找出当前文档中的可滚动的元素
			 * @returns {jQuery}
			 */
			findScroll:function(){
				var arr = [];
				$('body,div').each(function(){
					if($(this).css('overflowY')=='auto' && $(this).height()>300){
						arr.push(this);
					}
				});
				return $(arr);
			},
			listen:function(){
				//PV（浏览次数）仅与页面加载有关
//				this.logPV();
				//如果打开一个页面，会话时长有两天，而且没有执行任何刷新（如果真有这种场景），那么产生的PV是1，产生的UV（独立访客）是2
//				this.logUV();
//				setTimeout($.proxy(this.logUV,this),this.day);
				//而VV（访问次数），只要有交互动作就会判定是否产生了新的（半小时内仅可能有一次）
//				this.updateVV();
				
				this.pageLog('open');
				
				$(window).on('beforeunload',$.proxy(this.pageLog,this,'close'));
			},
			pageLog:function(type){
				var log = this.bin.get('log')||[];
				var datum = $.extend({
					logUrl:location.href,
					logTime:moment().format('YYYYMMDDhhmm'),
					eventType:type
				},this.baseInfo);
				if(type=='close'){
					datum.residenceTime = Date.now() - pub.start;
				}
				log.push(datum);
				this.bin.set('log',log);
			},
			start:function(dictNames){
				if(!pub.inited){	//避免一个文件多次调用pub.js导致错误统计
					$($.proxy(this.listen,this));
					this.bin.on('push',this.sync,this);
					this.versionControl();
					pub.inited = true;
				}				
				_(dictNames||[]).each(function(dictName){
					require(['analytics/dict/'+dictName],$.proxy(function(dict){
						if(_.isObject(dict.text)){
							this.bindByText(dict.text);
						}
						if(_.isObject(dict.selector)){
							this.bindBySelector(dict.selector);
						}
						if(_.isObject(dict.enter)){
							this.bindEnter(dict.enter);
						}
					},this));
				},this);
			},
			bindByText:function(config){
				_(config).each(function(it,text){
					if(!this.belong(it)){
						return;	//与当前页面无关，返回不作处理
					}
					if(this.isRepeat(it,text)){
						return;	//重复绑定，返回不作处理
					}
					$("a:contains('"+text+"')",it.context||document).click(it,$.proxy(this.logClick,this));
				},this);
			},
			bindBySelector:function(config){
				_(config).each(function(it,selector){
					if(!this.belong(it)){
						return;	//与当前页面无关，返回不作处理
					}
					if(this.isRepeat(it,selector)){
						return;	//重复绑定，返回不作处理
					}
					$(document).on('click',(it.context? it.context+ ' ':'')+selector,it,$.proxy(this.logClick,this));
				},this);
			},
			bindEnter:function(config){
				_(config).each(function(it,selector){
					$(document).on('keypress',selector,it,$.proxy(function(e){
						if(e.keyCode==13){
							this.logEnter(e);
						}
					},this));
				},this);
			},
			isRepeat:function(it,key){
				if(it.context){
					key = it.context + ' ' + key;
				}
				var repeat = !! this._pool[key];
				this._pool[key] = true;
				return repeat;
			},
			belong:function(it){
				var id = it.id;
				var pageId = it.pageId;
				if(!id){	//如果没有分配有ID，那就是超出产品期望的，统统作废
					return false;
				}
				if(!pageId){
					pageId='*';
				}
				if(pageId=='*'){
					pageId = this.pageId;
				}
				return _.isArray(pageId) ? pageId.indexOf(this.page) > -1 : pageId == this.pageId;
			},
			_pool:{},// _pool放在原型上，只为了避免重复绑定事件，以致于一次事件被监听多次
			sync:function(){
				/*var data = {
					uid:$.cookie('uid'),
					agent:navigator.userAgent,
					width:$(window).width(),
					height:$(window).height(),
					pv:0
				};
				
				//“裁”出PV
				var pv = this.bin.get('pv');
				var pv2 = {};
				data.pv = _(pv).map(function(it,key){
					pv2[key] = [it.shift()];
					return {
						name:key,
						num:it.length,
						list:it
					};
				});
				this.bin.set('pv',pv2,true);
				
				//“裁”出UV
				var uv = this.bin.get('uv');
				var uv2 = [uv.shift()];
				data.uv = {
					num: uv.length,
					list:uv
				};
				this.bin.set('uv',uv2,true);
				
				//“裁”出VV
				var vv = this.bin.get('vv');
				var vv2 = [vv.shift()];
				data.vv = {
					num : vv.length,
					list: vv
				};
				this.bin.set('vv',vv2,true);
				
				//“裁”出点击相关的交互
				var click = this.bin.get('click');
				data.click = _(click).map(function(it,key){
					return {
						page: key,
						list:_(it).map(function( arr ,name ){
							return {
								name:name,
								list:arr
							};
						})
					};
				});
				this.bin.set('click',{},true);
				
				//“裁”出回车相关的交互
				var enter = this.bin.get('enter');
				data.enter = _(enter).map(function(it,key){
					return {
						page: key,
						list:_(it).map(function( arr ,name ){
							return {
								name:name,
								list:arr
							};
						})
					};
				});
				this.bin.set('enter',{},true);*/
				
				var log = this.bin.get('log');
				this.bin.set('log',[],true);
				$.post(pub.remote,{log:log},function(){},'json');
			},
			clipper:[/;jsessionid=.*$/, /^(\/mogoroom\-([^/]+))?(\/pages)?/, /\.(.){2,}$/, /^\//],
			versionControl:function(){
				var version = this.bin.get('version');
				if(!version){
					version = pub.version;
					this.bin.set('version',version,true);
				}else if(version!=pub.version){	//版本跃迁处理
					this.bin.clear();
					this.bin.set('version',version,true);
				}
			},
			buildBaseInfo:function(){
				var info = {
						authId:$.cookie('renterid')||'',
						uid:$.cookie('uid'),
						sysId:'mogo-renter-pc',
						referrer:document.referrer,
						pagexy:$(window).width()+','+$(window).height()
				};
				var url,pageId;
				if(info.referrer){
					url = new URL(info.referrer);
					pageId = this.getPageCode(url.pathname);
					if(pageDict[pageId]){
						info.regPageId = pageDict[pageId];
					}
				}
				info.pageId = pageDict[this.pageId];
				return info;
			}
		};
		
		
		return Tracker;
	});
	
})(this);
