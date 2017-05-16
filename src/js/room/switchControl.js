/**
 * 定义一个AMD模块 switchControl
 * 一组切换按钮，用于切换地图的显示模式“列表”或者“全屏”
 */
define(['jquery','collection','BMap'],function($,Collection){
	function SwitchControl(){
		this.collection = new Collection();
		this.content = $(this.tmpl);
		this.content.children().click($.proxy(this.click,this));
		BMap.Control.apply(this,arguments);
	}
	SwitchControl.prototype	= Object.create(BMap.Control.prototype);

	var extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };
    
    extend(SwitchControl.prototype,{
    	constructor:SwitchControl,
    	initialize:function(map){
    		map.getContainer().appendChild(this.content[0]);
    	},
    	click:function(e){
    		var el = $(e.target);
    		if(el.is('.active')){
    			return;
    		}
    		el.siblings().removeClass('active').end().addClass('active');
    		this.collection.trigger('change',el.is('.reduce')?'-':'+');
    	},
    	change:function(){
    		$(this.content).find('.active').siblings().addClass('active').end().removeClass('active');
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
    	tmpl:'<span class="map-control-switch">'+
				'<button type="button" class="reduce active" title="切换地图到列表模式">列表</button>'+
				'<button type="button" class="enlarge" title="切换地图到全屏模式">全屏</button>'+
			'</span>'
    });
    
	return SwitchControl;
});