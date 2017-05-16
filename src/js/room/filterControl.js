/**
 * 定义一个AMD模块 FilterControl
 * 用于对地图中的小区图标进行过滤
 * 当前可过滤的选项集是 集中式房源、分散式房源 （非默认，需要配置）
 */
define(['jquery','collection','underscore','BMap'],function($,Collection,_){
	
	function FilterControl(opt){
		opt = opt||{};
		if(opt.mark!=null){
			this.mark = opt.mark;
		}
		if(opt.tmpl!=null){
			this.tmpl = opt.tmpl;
		}
		this.collection = new Collection();
		this.content = $(_.template(this.tmpl)({list:opt.list||[]}));
		this.content.children().click($.proxy(this.click,this));
		this.on('change',this.change,this);
		BMap.Control.apply(this,arguments);
	}
	FilterControl.prototype	= Object.create(BMap.Control.prototype);

	var extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };
    
    
    extend(FilterControl.prototype,{
    	initialize:function(map){
    		map.getContainer().appendChild(this.content[0]);
    	},
    	click:function(e){
    		var el = $(e.target).closest('button');
    		this.collection.trigger('change',$('.fa',el).is('.fa-check')?null:el.val());
    		return this;
    	},
    	change:function(value){
    		this.content.find('.fa').removeClass(this.mark);
    		if(value!=null){
    			this.content.find('[value="'+value+'"] .fa').addClass(this.mark);
    		}
    		return this;
    	},
    	on:function(event,handler,context){
    		this.collection.on(event,handler,context);
    		return this;
    	},
    	off:function(event,handler){
    		this.collection.off(event,handler);
    		return this;
    	},
    	hidden:function(){
    		this.content.css({display:'none'});
    		return this;
    	},
    	show:function(){
    		this.content.css({display:'block'});
    		return this;
    	},
    	isMarked:function(el,context){
    		return $(el,context||this.content).is('.'+this.mark);
    	},
    	mark:'fa-check',
    	tmpl:'<div class="map-control-filter">'
    		+'<% _.each(list,function(it){%>'
    		+'<button type="button" value="<%=it.code%>"><em style="background-color:<%=it.color%>"></em><%=it.name%><i class="fa"></i></button>'
    		+'<%});%>'
    		+'</div>'
    });
    
	return FilterControl;
});