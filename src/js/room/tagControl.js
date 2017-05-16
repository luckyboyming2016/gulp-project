/**
 * 定义一个AMD模块 TagControl
 * 地图侧的一个系带，用于切换地图的显示模式“列表”或者“全屏”
 */
define(['jquery','collection','BMap'],function($,Collection){
	function TagControl(){
		this.collection = new Collection();
		this.content = $(this.tmpl);
		BMap.Control.apply(this,arguments);
		this.content.click($.proxy(this.click,this));
	}
	TagControl.prototype = Object.create(BMap.Control.prototype);

	var extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };
    
    extend(TagControl.prototype,{
    	constructor:TagControl,
    	initialize:function(map){
    		map.getContainer().appendChild(this.content[0]);
    	},
    	click:function(e){
    		this.collection.trigger('change',this.change());
    	},
    	change:function(){
    		return $(this.content).find('.fa').toggleClass('fa-rotate-180').is('.fa-rotate-180')?'+':'-';
    	},
    	on:function(event,handler,context){
    		this.collection.on(event,handler,context);
    	},
    	off:function(event,handler){
    		this.collection.off(event,handler);
    	},
    	hidden:function(){
    		this.content.css({display:'none'});
    	},
    	show:function(){
    		this.content.css({display:'block'});
    	},
    	tmpl:'<button type="button" class="map-control-tag" title="切换地图宽度"><i class="fa fa-angle-left"></i></button>'
    });
    
	return TagControl;
});