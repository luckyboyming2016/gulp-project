/**
 * 定义了一个AMD模块 marker
 * 该模块也依赖于jQuery
 * marker 继承自 BMapLib.RichMarker
 * marker 添加了一些操纵其父元素的z-index的方法：fly,fall
 * 添加了行为方法： autoHover
 * 添加了一些操纵其对应DOM的class类的方法：manual, open, close
 * 添加了判断其对应DOM的class类的方法：is
 */
define(['jquery','BMap','BMapLib.RichMarker'],function($){
	
	function Marker(){
		/**
		 * 在子类（即Marker）中调用父类（即BMapLib.RichMarker）的构造函数
		 * 无法通过 Marker.prototype = new BMapLib.RichMarker()这样的方式构建继承链
		 * 因为构建原型时并没有相应的上下参数信息，比如marker所属的地图
		 */
		BMapLib.RichMarker.apply(this,arguments);
		this.autoHover();
	}
	
	/**
	 * 通过ES5 的 Object.create复制BMapLib.RichMarker的原型链构建Marker的原型链
	 */
	var fn = Marker.prototype 
		   = Object.create(BMapLib.RichMarker.prototype);
	
	fn.constructor = Marker;

	/**
	 * 让marker的容器的CSS属性z-index变大为（默认变大为0）
	 * 体现出的效果就是当前marker堆在最上面，不被其它marker堆挡
	 * 在容器中用自定义属性zIndex记录之前的 z-index 以便需要时恢复
	 * 如果已经将容器的CSS属性z-index变大过一次，则将不再重复处理
	 */
	fn.fly = function(e,z){
		var wrapper = $(this._container),
			key = 'zIndex';
    	if( wrapper.attr(key) == undefined){
    		wrapper.attr(key,wrapper.css(key));
    		wrapper.css(key,z||0);
    	}
    	return this;
	};
	
	/**
	 * 恢复marker的容器的CSS属性z-index，并移除上面的自定义属性zIndex
	 * 恢复的值是从容器的自定义属性zIndex中读取的
	 * 如果对应marker是打开的，则不作处理
	 */
	fn.fall = function(){
		var wrapper = $(this._container),
			marker = wrapper.children(),
			key = 'zIndex';
    	if( !marker.is('.open') ){
    		wrapper.css(key,wrapper.attr(key));
    		wrapper.removeAttr(key);
    	}
    	return this;
	};

	/**
	 * 将marker对应的DOM中添加一个CSS类manual标记一下
	 * 主要是区分一下marker是自动打开还是手动打开的
	 * 一般来说，自动打开的会在某些情况下也自动关闭
	 * 但是手动打开的只能手动关闭
	 * 
	 * marker不显示标题，点击一下marker，然后marker展开了标题栏显示小区名，这称之为手动打开
	 * 当页面加载时marker只有一个，marker会展开标题栏显示小区名，这称之为自动打开
	 */
    fn.manual = function(){
        $(this._container).children().addClass('manual');
        return this;
    };
	
    /**
     * 打开marker，使其显示标题栏中的小区名称
     */
	fn.open = function(){
		$(this._container).children().addClass('open'); 
		return this;
	};

	/**
	 * 关闭marker，使其不显示标题栏中的小区名称
	 * 并移除标记类 manual
	 */
    fn.close = function(){
        $(this._container).children().removeClass('open manual');
        return this;
    };

    /**
     * 判断marker对应DOM的是否具有某class类，并返回判断结果
     * @returns 布尔值 判断结果
     */
	fn.is = function(selector){
		return $(this._container).children().is(selector);
	};
	
	/**
	 * 添加自动悬浮功能
	 * 当鼠标移到marker上面时使其不被其它重叠的marker遮挡
	 * 当鼠标移出时恢复原状
	 */
	fn.autoHover = function(){
		this.addEventListener('mouseover', this.fly);
        this.addEventListener('mouseout', this.fall);
	};
	
	fn.viewed = function( viewed ){
		if(viewed){
			$(this._container).children().addClass('viewed');
		}
		return this;
	};

	return Marker;
});