define(['jquery'],function(){
	function Sorter( opt ){
		this.context = $(opt.context);
		this.orderMap = opt.orderMap;
		this.signClass = opt.signClass;
		this.isDesc = opt.isDesc;
		this.setDesc = opt.setDesc;
		this.defaultValue = opt.defaultValue;
	}
	
	Sorter.prototype = {
		val:function( v ){
			var el,curr;
			if( v === void 0){	// get value
				el = this.context.find('.'+this.signClass);
				_(this.orderMap).find(function(it,order){
					var find = el.is(it.target);
					if(it.desc){
						find = find && this.isDesc(el);
					}
					if(find){
						v = order;
					}
					return find;
				},this);
				return v;
			}else{	// set value
				curr =this.orderMap[v];
				if(curr == void 0){
					console.warn('unkown sorting by value '+v);
					return;
				}
				this.context.find('.'+this.signClass).removeClass(this.signClass);
				el = this.context.find(curr.target).addClass(this.signClass);
				this.setDesc(el,curr.desc);
			}
		},
		reset:function(){
			this.val(this.defaultValue);
		}
	};
	return Sorter;
});