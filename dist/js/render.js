!function($){var Render=function(e){this.ngRepeatElements={},this.bindEvents={}};Render.prototype={getContainer:function(){return $("body")},bind:function(e,t){this.bindEvents[e]=t},trigger:function(e,t){this.bindEvents[e]&&this.bindEvents[e](t)},render:function(e){var t,n=this;for(t in this.ngRepeatElements)this.renderNgRepeat(this.ngRepeatElements[t].$element,e);$("[ng-repeat]").each(function(){n.renderNgRepeat($(this),e)}),this.renderNg(this.getContainer(),e,"ng-bind"),this.renderNg(this.getContainer(),e,"ng-src"),this.renderNg(this.getContainer(),e,"ng-href"),this.renderNgShow(this.getContainer(),e),this.trigger("event-fetch-success",e)},getScopeData:function(e,t){if(e&&t){e=e.indexOf(".")?e.split("."):[e];var n,a,s=t;for(n=0,a=e.length;n<a;n++)s&&(s=s[e[n]]);return s}},renderNgShow:function($container,scopeData){var _this=this,$element=$container.find("[ng-show]");$element.each(function(){var isShow=!1,data,values=$(this).attr("ng-show");if(values=values.replace(/(^\s+)|(\s+$)/g,""),values.match(/^\!\w+$/))data=_this.getScopeData(values.replace("!",""),scopeData),data||(isShow=!0),this.style.display=isShow?"":"none";else if(values.match(/^\w+$/))data=_this.getScopeData(values.replace("!",""),scopeData),data&&(isShow=!0),this.style.display=isShow?"":"none";else{oldValues=values,values=values.split(/\s+/);var i=0,is_has_value=!1;_this.each(values,function(e){is_has_value||(e.match(/^\w+$/)||e.match(/\./)&&e.match(/\w/))&&(data=_this.getScopeData(e,scopeData))&&(values[i]=data,i++,is_has_value=!0)});var newValues=values.join(" ");newValues!==oldValues&&(isShow=eval(newValues),this.style.display=isShow?"":"none")}})},renderNg:function(e,t,n){var a=this;e.find("["+n+"]").each(function(){var e=$(this).attr(n),s=a.getScopeData(e,t);switch(n){case"ng-bind":$(this).html(s);break;case"ng-src":case"ng-href":$(this).attr(n.replace("ng-",""),s)}(s||0===s)&&this.removeAttribute(n)})},renderNgRepeat:function(e,t){var n=e.attr("ng-repeat"),a=n.split(/\s+in\s+/);this.ngRepeatElements[n]||(e[0].style.display="",this.ngRepeatElements[n]={$element:e,$container:e.parent()},e.remove());var s=this.getScopeData(a[1],t);this.each(s,function(e){var t=this.ngRepeatElements[n].$element.clone();t[0].removeAttribute("ng-repeat");var s={};s[a[0]]=e,this.renderNg(t,s,"ng-bind"),this.renderNg(t,s,"ng-src"),this.renderNg(t,s,"ng-href"),this.ngRepeatElements[n].$container.append(t),this.renderNgShow(t,s)})},each:function(e,t){var n,a;for(n=0,a=e.length;n<a;n++)t.call(this,e[n])}},window.Render=Render}(Zepto);