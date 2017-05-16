define(['jquery','collection'],function($,Collection){
	
	function Bin(opt){
		opt = $.extend({
			limit:30
		},opt||{});
		this.limit = opt.limit;	//最大调用set方法次数。过了该次数，需要将数据转移到服务器中
		this.collection = new Collection();
		try{
			localStorage.Mogo_GA = localStorage.Mogo_GA || '{}';
			this.localStorageAvailable = true;
		}catch(e){
			this.cache =  {};
			this.localStorageAvailable = false;
			$(document).one('unload',$.proxy(function(){
				this.collection.trigger('push',{sync:true});
			},this) );
		}
		this.count = this.get('_count')||0;
	}
	
	Bin.prototype = {
		set:function(key,value,ignore){
			var place;
			if(this.localStorageAvailable){
				place = JSON.parse(localStorage.Mogo_GA);
				place[key] = value;
				localStorage.Mogo_GA = JSON.stringify(place);
			}else{
				this.cache[key] = value;
			}
			if(!ignore){
				this.check();
			}
		},
		get:function(key){
			return (this.localStorageAvailable ? JSON.parse(localStorage.Mogo_GA) : this.cache)[key];
		},
		clear:function(){
			if(this.localStorageAvailable){
				localStorage.removeItem('Mogo_GA');
			}else{
				this.cache = {};
			}
		},
		check:function(){
			this.count++;
			if(this.count>=this.limit){
				this.count = 0;
				this.collection.trigger('push');
			}
			this.set('_count',this.count,true);
		},
		on:function(event,handler,context){
			this.collection.on(event,handler,context);
		}
	};
	
	return Bin;
});