define(["jquery","collection"],function(t,o){function i(i){i=t.extend({limit:30},i||{}),this.limit=i.limit,this.collection=new o;try{localStorage.Mogo_GA=localStorage.Mogo_GA||"{}",this.localStorageAvailable=!0}catch(o){this.cache={},this.localStorageAvailable=!1,t(document).one("unload",t.proxy(function(){this.collection.trigger("push",{sync:!0})},this))}this.count=this.get("_count")||0}return i.prototype={set:function(t,o,i){var c;this.localStorageAvailable?(c=JSON.parse(localStorage.Mogo_GA),c[t]=o,localStorage.Mogo_GA=JSON.stringify(c)):this.cache[t]=o,i||this.check()},get:function(t){return(this.localStorageAvailable?JSON.parse(localStorage.Mogo_GA):this.cache)[t]},clear:function(){this.localStorageAvailable?localStorage.removeItem("Mogo_GA"):this.cache={}},check:function(){this.count++,this.count>=this.limit&&(this.count=0,this.collection.trigger("push")),this.set("_count",this.count,!0)},on:function(t,o,i){this.collection.on(t,o,i)}},i});