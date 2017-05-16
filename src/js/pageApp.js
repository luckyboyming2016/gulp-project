    // 权限
    var ug = window.navigator.userAgent,
        href = window.location.href;
    /*if(href.indexOf("//test2.")<0 && href.indexOf("//dev.")<0 && ug.indexOf("ShiHui")<0){
        window.location.href="/pageapp/html/java/1.3.5/ramp.html";
    }*/

    window.pageAppCommon = window.pageAppCommon || {};

    pageAppCommon.appDownloadHref = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.lanshan.weimicommunity';

    /*获取字符长度（汉字算2个字符）*/
    pageAppCommon.getStringLength = function(str) {
        if (str == null) return 0;
        if (typeof str != "string") {
            str += "";
        }
        return str.replace(/[^x00-xff]/g, "01").length;
    }

    /*判断设备类型*/
    pageAppCommon.viewPort = function() {
        var u = navigator.userAgent.toLowerCase();
        return {
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

    pageAppCommon.unixToDatetime = function(datetime) {
        var now = new Date(datetime);
        var year = now.getFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate(),
            hour = now.getHours(),
            minut = now.getMinutes(),
            secon = now.getSeconds();
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minut < 10) {
            minut = "0" + minut;
        }
        if (secon < 10) {
            secon = "0" + secon;
        }
        if (year != NaN) {
            return year + "-" + month + "-" + day + " " + hour + ":" + minut + ":" + secon;
        } else {
            return ""
        }
    }

    /*秒 转换成 时分秒*/
    pageAppCommon.convertSecondsToHMS = function(value) {
        var second = parseInt(value); // 秒
        var minute = 0; // 分
        var hour = 0; // 小时

        if (second > 60) {
            minute = parseInt(second / 60);
            second = parseInt(second % 60);

            if (minute > 60) {
                hour = parseInt(minute / 60);
                minute = parseInt(minute % 60);
            }
        }
        second = parseInt(second);
        if (minute > 0) {
            minute = parseInt(minute);
        }
        if (hour > 0) {
            hour = parseInt(hour);
        }
        return [hour, minute, second];
    };

    /*读取url里get参数*/
    pageAppCommon.queryUrl = function(name) {
        var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)", "i");
        var _uri = decodeURIComponent(window.location.search);
        var r = _uri.substr(1).match(reg);
        if (r != null) {
            return r[2];
        } else {
            if (name == "c") {
                return window.localStorage.cityid || null;
            } else if (name == "communityid") {
                return window.localStorage.communityid || null;
            } else if (name == "communityname") {
                return window.localStorage.communityname || null;
            } else {
                return null;
            }
        }
        return null;
    }

    pageAppCommon.validatePhone = function(phone) {
        return phone.match(/^0{0,1}(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])[0-9]{8}$/); // /^1\d{10}$/.test(phone);
    }

    pageAppCommon.validateChinese = function(text, number) {
        return /^[\u4e00-\u9fa5]{1,4}$/.test(text);
    }

    /*根据图片id获取完整图片地址*/
    pageAppCommon.getImageUrl = function(imgId, width) {
        width = width || 100;
      // var _url = window.location.href;
        if(process.env.NODE_ENV == 'production'){
            return 'http://img.hiwemeet.com/pic/' + imgId + '/' + width;
        }else{
             return 'http://test2.img.hiwemeet.com/pic/' + imgId + '/' + width;
        }
    };





    /*微信分享设置*/
    pageAppCommon.weixinShare = function(title, desc, img, link) {
        var options = {
            "title": title,
            "desc": desc,
            "imgUrl": this.getImageUrl(img, 300),
            "link": link || window.location.href
        };
        window.WxApi.share(options);
    }

    /*下载APP*/
    pageAppCommon._callback_down = function() {
        _wm.push(['_trackevent', 'shihui_had_win', 'downLoad', 'cityload', this.queryUrl("c")]);
        window.location.href = this.appDownloadHref;
    }

    /*更多福利*/
    pageAppCommon._callback_moreWelfare = function() {
            window.location.href = 'http://api.hiwemeet.com/pageapp/html/java/extend_slot_welfare/index.html?from_channels=1';
        }
        /*微信分享提示标志*/
    pageAppCommon._callback_share = function() {
        window.scrollTo(0, 0);
        var viewPort = this.viewPort();
        if (viewPort.ios) {
            $("#ios_marker").show();
        }
        if (viewPort.android) {
            $("#android_marker").show();
        }
    }
