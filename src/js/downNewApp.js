"use strict";
/**
 * 公用的顶部实惠APP下载banner
 */

;(function($) {
	/**
	 * 分享
	 * @return {[type]} [description]
	 */
	var viewPort = function() {
		var u = navigator.userAgent.toLowerCase();
		return {
			isShihui: u.indexOf('shihui') > -1,
 			isWeixin: u.indexOf('micromessenger') > -1,
 			trident: u.indexOf('trident') > -1, //IE内核
			presto: u.indexOf('presto') > -1, //opera内核
			webKit: u.indexOf('applewebkit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('gecko') > -1 && u.indexOf('khtml') == -1, //火狐内核
			mobile: !!u.match(/applewebkit.*mobile.*/) || !!u.match(/applewebkit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
			android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iphone') > -1 || u.indexOf('mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('ipad') > -1, //是否iPad
			webApp: u.indexOf('safari') == -1 //是否web应该程序，没有头部与底部
 		}
	};

	function DownApp(options) {
		this.id = options.id || "foot_ad";
	};

	DownApp.prototype = {
		init: function() {
			this.append();
		},
		create: function() {
			var _this = this;

			var _div = document.createElement('div'),
				_p = document.createElement('p'),
				_img = document.createElement('span'),
				_span = document.createElement('span'),
				_a = document.createElement('a');

			_div.style.background = "rgba(255,255,255,0.8)";
			_div.style.height = "3.413333rem";
			_div.style.padding = "0.671875rem";
			_div.style.paddingTop = "0.5rem";
			_div.style.width = "100%";
			_div.style.position = "fixed";
			_div.style.left = 0;
			_div.style.top = 0;
			_div.style.zIndex = 1000;
			_div.id = _this.id;

			_p.style.position = "relative";
			/*_img.style.width = "5.36rem";
			_img.style.height = "2.24rem";
			_img.style.verticalAlign = "middle";*/
			_img.className = "topLogoImg";
			_img.alt = "实惠APP";

			_span.style.display = "inline-block";
			_span.style.color = "#4a4a4a";
			_span.style.fontSize = "0.64rem";
			_span.style.marginLeft = "0.906667rem";
			_span.style.marginTop = "0.8rem";
			_span.innerHTML = "来实惠，摇免费！";

			_a.style.color = "#fff";
			_a.style.fontSize = "0.8rem";
			_a.style.background = "#e45751";
			_a.style.width = "6.133333rem";
			_a.style.height = "1.866667rem";
			_a.style.textAlign = "center";
			_a.style.lineHeight = "1.866667rem";
			_a.style.position = "absolute";
			_a.style.top = "3px";
			_a.style.right = 0;
			_a.style.zIndex = 2;
			_a.style.borderRadius = "0.266667rem";
			_a.id = "download";
			_a.href = "javascript:void(0)";
			_a.onClick = "_wm.push(['_trackevent', 'shihui_detail_merchant', 'download']);";
			_a.innerHTML = "立即下载";
			_a.className = "downbtn";

			_p.appendChild(_img);
			_p.appendChild(_span);
			_p.appendChild(_a);
			_div.appendChild(_p);

			return _div;
		},
		append: function() {
			var _div = this.create();

			if(document.getElementById(this.id)) {
				return;
			} else {
				$("body").css("padding-top", "3.4rem").append(_div);
				this.downEvent();
			}
		},
		downEvent: function() {
			$(".downbtn").on('click', function() {
				if(viewPort().isWeixin) {
					window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.lanshan.weimicommunity";
				} else {
					window.location.href = "http://download.17shihui.cn/";
				};
			});
		}
	};

	var downApp = new DownApp({});
	downApp.init();
})(Zepto);