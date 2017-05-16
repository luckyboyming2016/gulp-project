/**
 * 定义了一个AMD模块 MarkerManager
 * 随着对地图中的房源标记的展示形式越来越多，需要一个管理器来管理这些房源标记图标
 * 
 * 该模块依赖于：
 *  underscore（提供类型判断，遍历支持以及一些常用功能支持）
 *  template（提供模板引擎）
 *  room/marker(继承自BMap.RichMarker，一个marker对应于一个房源标记，它是当前manager处理的主体) 
 *  collection(提供事件挂载系统）
 */
define( ['jquery','underscore','template'      ,'room/marker','collection','BMap'],
function( $      , _          , templateEngine , Marker      , Collection){
		
	function MarkerManager(opts){
		// 如果opt未传入，把它赋值为一个空对象
		opts = opts||{};
		// markerManager的上下文，具体是指百度地度实例
		this.context = opts.context;
		this.root = opts.root;
		// 模板获取函数
		this.getTemplate = opts.getTemplate;
		// 偏移量的获取函数
		this.getOffset = opts.getOffset;
		// 地图上正在显示的所有marker点的一个哈希表，用communityId作key索引，每一个项是一个marker
		// 每次AJAX加载数据会刷新该集合
		this.history = {};
		// 延迟队列，该队列用于放置延迟函数
		this.deferQuene = [];
		//标记第一次加载
		this.ready = false;
		// 挂载事件的集合
		this.collection = new Collection();
		// 使用style:"z-index:0"正在较高z层显示的marker
		this.flyingMarker = null;
		// 已经访问过的marker的记录
		this.viewed = {};
		// 特殊规则，对应于 setMarkers时 列表中只有一条数据的这种情况
		this.ifOnly = opts.ifOnly;
		// 缓存仓库，缓存预加载的marker点以用作提高拖拽地图的渲染速度
		this.bin = [];
		//小区房源预加载promise
		this.deferPromise = null;
	}
	
	MarkerManager.prototype = {
			constructor:MarkerManager,
			/**
			 * 在上下文对象（百度地图实例）中添加单个房源麻点
			 * @param data	房源麻点所对应的数据
			 * @param frag	将要添加的房源麻点的HTML片
			 * @param offset	将要添加的房源麻点的偏移量
			 */
			addMarker:function( data , frag , offset ){
				var pos = this.point(data);
	            var marker = new Marker(frag,pos);
	            marker.zoomLevel = data.zoomLevel;
	            marker.data = data;
	            this.context.addOverlay(marker);
	            marker.setAnchor(offset);
	            this.history[data.id] = marker;
	            /**
	             * 挂载事件，如果有。
	             */
	            _(this.collection.hashMap).each(function(handlerList,type){
					if( _.isEmpty(handlerList) ){
						return;
					}
					_(handlerList).each(function(handler){
						marker.addEventListener(type,handler.invoke);
					},this);
				},this);
			},
			/**
			 * 根据数据生成对应的point对象
			 * @param data 房源麻点所对应的数据
			 * @returns {BMap.Point}	百度地图的BMap.Point对象
			 */
			point:function(data){
				if(!data.lat&&!data.lng){
					console.warn('经纬度数据异常: \n'+JSON.stringify(data));
				}
				return new BMap.Point(data.lng, data.lat);
			},
			/**
			 * 批量添加房源麻点
			 * @param arr 房源麻点所对应的数据数组
			 * @param zoomLevel	当前缩放等级
			 * @param local 标志量，是否是使用本地缓存更新，还是使用AJAX获取的数据更新
			 * 如果为true表示使用本地缓存更新
			 */
			setMarkers:function( arr,zoomLevel,local ){
				/**
				 *  为房源数据添加备选值，使其等于null时也是一个（空）数组
				 */
				arr = arr||[];
				/**
				 * 每次AJAX加载数据刷新地图中的房源麻点时（非拖拽时使用本地缓存刷新）
				 * local参数不传递，其缺省值为undefined, !local等于true 可进入下面if语句
				 * 
				 * 当拖拽刷新时 , 
				 * local传入的参数为true, !local等于false 不进入下面的if语句
				 * 
				 * 当进入下面if语句（每次AJAX刷新加载的房源数据）时，需要做以下预处理：
				 * 1. 把所有的数据克隆到仓库(this.bin)里
				 * 2. 移除所有的 marker ，包括从上下文对象（地图实例）中移走marker，从当前对象的记录表（this.history）中删除对应记录，以及相应的引用清除
				 * 3. 记录下当前的缩放级别
				 */
				if(!local){	
					this.bin = _.clone(arr);
					this.removeAll();
					if(arr.length>=50){
					//	arr = this.filter(arr);
					}
					this.currZoomLevel = zoomLevel;
				}
				/**
				 * 通过模板引擎生成装订器，以便通过装订（render）对应的业务数据生成相应的HTML片
				 * 当前使用的腾讯的artTemplate，然而它对外界是透明的（也就是说markerManager使用什么JS模板引擎外界是不可感知的，也不用关心）
				 */
				var compile = templateEngine.render( this.getTemplate( zoomLevel ) );
				/**
				 * 遍历数据，逐一添加房源麻点
				 */
				_(arr).each(function(it){
					/**
					 * 对于小区级别的房源数据，主键是的key是用communityId索引而不是用id索引，
					 * 使其变为id索引
					 */
					if(it.communityId){
						it.id = it.id||it.communityId;
					}
					/**
					 * 如果数据没有id，则添加一个伪随机数作为id，作为应对脏数据的一种策略
					 * 因为如果一个数据没有id的话，它就无法在记录表（this.history,this.viewed）中正确索引
					 * 在切换地图的缩放级别时，无法找到它们并清除
					 */
					if(!it.id){
						it.id = Math.floor((Math.random()*1e10));
					}
					/**
					 * 如果记录中已记录了 相应marker，则不重复添加
					 */
					if(this.history[it.id]!=null){
						return;
					}
					/**
					 * 每个缩放级别（community,circle,region,city）都使用一些图标
					 * 这些图标需要正确定位需要设置一个偏移量
					 * 根据缩放级别找到对应的偏移量
					 * 如果一个缩放级别有多种图标，则使用数据辅助获取偏移量
					 */
					var offset = this.getOffset(zoomLevel,it);
					/**
					 * 修饰数据，让每个数据知道当前缩放级别，以及文件路径上下文
					 */
					it.zoomLevel = zoomLevel;
					it.root = this.root;
					/**
					 * 在记录表(this.viewed)中对比当前记录是否已浏览
					 * 如果数据所对应的房源已浏览，标识当前数据为已浏览
					 */
					if(this.viewed[it.id]){
						it.viewed = this.viewed[it.id];
					}
					/**
					 * 添加当前房源麻点
					 */
					this.addMarker(it,compile(it),offset);
				},this);
				/**
				 * 后置处理
				 * 批量添加房源麻点图标后的一些处理
				 * 也是每次AJAX加载数据刷新地图中的房源麻点时才处理，
				 * 拖拽时使用本地缓存刷新并不作处理
				 * 包括（有顺序性）：
				 * 1. 处理遗留的延时任务
				 * 2. 如果地图中只有一个房源麻点（可能在视野外），把它倒置给调用者处理
				 * 3. 对地图的视野进行适配，如果视野内没有房源麻点，抓一个房源麻点移到地图中央
				 */
				if(!local){
					this.task();
					if(this.ifOnly && arr.length==1){
						this.ifOnly.call(this.getMarker(arr[0].id),arr[0]);
					}
					if(arr.length>0){
						this.viewportAdapter();
					}
				}
			},
			/**
			 * 处理遗留任务（需要数据故延迟处理的）
			 * 1. 第一次加载，绑定drag end事件，drag end后，重新添加地图上的房源麻点
			 * 2. 执行延迟队列里的任务，然后清空延迟队列
			 *   一些方法需要放到延迟队列里主要是因为它们的正确执行依赖于marker是否已在界面中渲染
			 */
			task:function(){
				if(!this.ready){
					this.context.addEventListener('dragend',$.proxy(this.redraw,this));				
					this.ready = true;
				}
				_(this.deferQuene).each(function(it){
					it.invoke(this.history[it.key]?this.history[it.key].data:null);
					it.invoke = null;
				},this);
				this.deferQuene = [];
			},
			/**
			 * 清除上下文对象（地图）中的所有marker对象
			 * 当前对象也对地图中的所有marker对象持有一个字典表，清空字典表
			 */
			removeAll:function(){
				_(this.history).each(function( marker ){
					this.context.removeOverlay( marker );
					marker = null;
				},this);
				this.history = {};
				this.bin = [];
			},
			/**
			 * 为管理器设置上下文对象（地图）
			 * @param context {BMap.Map} 百度地图对象实例
			 */
			setContext:function(context){
				this.context = context ; 
			},
			
			/**
			 * 根据id获取该id索引的对应marker
			 * @param id
			 * @returns
			 */
			index:function(id){
				return this.history[id]||null;
			},
			/**
			 * 设置图片路径的上下文 
			 * @param root
			 */
			setRoot:function(root){
				this.root = root;
			},
			query:function(key,invoke,immediate){
				var marker;
				if(immediate){
					invoke(this.history[key]||null);
				}else{
					if(this.ready){
						marker = this.history[key];
						invoke(marker==null?null:marker.data);
					}else{
						this.deferQuene.push({invoke:invoke,key:key});
					}
				}
			},
			on:function(event,handler,context){
				this.collection.on(event,handler,context);
				_(this.history).each(function(marker){
					marker.addEventListener(event,handler);
				},this);
			},
			off:function(event,handler){
				this.collection.off(event,handler);
				_(this.history).each(function(marker){
					marker.removeEventListener(event,handler);
				},this);
			},
			getMarker:function(id){
				return this.history[id]||null;
			},
			setMarkerCenter:function( id ){
				var marker = null;
				if( id instanceof BMapLib.RichMarker){
					marker = id;
				}else{
					marker = this.history[id];
				}
				if(marker==null || !marker.data){
					return this;
				}
				var lng = marker.data.lng,
					lat = marker.data.lat;
				if( !lng || !lat ){
					console.warn('marker无法居中，因为没有经纬度 ');
					return this;
				}
				this.collection.trigger('sign',new BMap.Point(lng,lat));
				//this.context.panTo( new BMap.Point(lng,lat) );
			},
			fly:function( marker ){
				if(this.flyingMarker!=null){
					this.flyingMarker.fall();
				}
				marker.fly();
				this.flyingMarker = marker;
			},
			fall:function(){
				if( this.flyingMarker!=null ){
					this.flyingMarker.fall();
					this.flyingMarker = null;
				}
			},
            open:function(marker){
                if(this.flyingMarker!=null){
                    this.flyingMarker.close();
                }
                marker.open();
            },
            close:function(marker){
                if( this.flyingMarker!=null ){
                    this.flyingMarker.close();
                    this.flyingMarker = null;
                }
            },
            //标记一个marker为已点击，这样AJAX加载重新渲染时可以把已点击的这部分用特殊的样式标记
            //注意当按F5刷新时，将清空已记录的marker 重新开始记录
			addClicked:function(marker){
				_(this.viewed).each(function(number,id){
					var m = this.history[id];
					if(m!=null){
						m.viewed(true).close().fall();
					}
				},this);
				if(this.viewed[marker.data.id]){
					this.viewed[marker.data.id] += 1;
		        }else{
		        	this.viewed[marker.data.id] = 1;
		        }
			},
			/**
			 * 视口适配
			 * 如果当前视口（视野）内没有可见的marker，则将移一个marker到地图中心
			 */
			viewportAdapter:function(){
				var viewport = this.context.getBounds();
				// nothing === true 表示当前视野内没有marker
				var nothing = _(this.history).every(function(marker){
					return !viewport.containsPoint(marker.getPosition());
				});
				if(nothing){
					//取一个marker移到地图中心
					for(var key in this.history){
						this.collection.trigger('sign', this.history[key].getPosition() );
						setTimeout($.proxy(function(){
							this.collection.trigger('sign', this.history[key].getPosition() );
						},this),400);
						break;
					}
				}
			},
			/**
			 * 过滤数据，通过经纬度计算，返回分布在当前视野范围内的的数据
			 * @param list {Array} 要进行过滤操作的源数组
			 * @param viewport {BMap.Bounds} 视野范围，选填，默认为当前视野范围
			 * @returns {Array} 分布在当前视野范围内的的数据，数组
			 */
			filter:function(list,viewport){
				viewport = viewport || this.context.getBounds();
				return _(list||[]).filter(function(it){
					if( !it.lng||!it.lng ){
						return false;
					}
					return viewport.containsPoint(new BMap.Point(it.lng,it.lat) );
				});
			},
			/**
			 * 重绘地图，绘出当前视野内的房源麻点
			 * 小区级别使用deferPromise来重绘，其它使用bin里面的数据来重绘
			 * bin是AJAX加载后的获得源数据
			 * deferPromise是预加载的数据
			 */
			redraw:function(){
				if(this.currZoomLevel=='community' && this.deferPromise){
					this.deferPromise.done($.proxy(function(data){
						this.setMarkers(this.filter(data.communities),this.currZoomLevel,true);
					},this));
				}else{
					this.setMarkers(this.filter(this.bin),this.currZoomLevel,true);
				}
			}
	};
	
	return MarkerManager;
});