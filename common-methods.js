/**
 * Created by sun on 2017/6/22.
 */
var iosSrc = '';
var androidSrc = '';

function weiChatShareFn(share,url,requestUrl,path){
    var aliyunServerUrl = url ? url : window.location.protocol + 'path';
    var weiXinConfigObj;

    $.ajax({
        type:"get",
        url: "requestUrl",
        dataType:"json",
        data:{"url":window.location.href.split('#')[0]},
        success:function(data){
            weiXinConfigObj = data;
            console.log(weiXinConfigObj);
        }
    });
    window.onload = function (weiXinConfigObj) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: weiXinConfigObj.appId, // 必填，公众号的唯一标识
            timestamp: weiXinConfigObj.timestamp, // 必填，生成签名的时间戳
            nonceStr: weiXinConfigObj.nonceStr, // 必填，生成签名的随机串
            signature: weiXinConfigObj.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline',
                'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function(){

            //获取“分享到朋友圈”按钮点击状态及自定义分享内容
            wx.onMenuShareTimeline({
                title: share.title, // 分享标题
                link: share.url, // 分享链接
                imgUrl: share.imgUrl, // 分享图标
                success: function () {},
                cancel: function () {}
            });
            //获取“分享给朋友”按钮点击状态及自定义分享内容
            wx.onMenuShareAppMessage({
                title: share.title, // 分享标题
                desc: share.desc, // 分享描述
                link: share.url, // 分享链接
                imgUrl: share.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {},
                cancel: function () {}
            });
        })
    }
}
function showWelcomeWord(e,callback){ // 注册成功后填下载地址

    var obj = new Browser();

    if(obj.is_weixin()){
        $(e).find('a').attr('href',androidSrc);
    }else{
        if(obj.is_ios()){
            $(e).find('a').attr('href',iosSrc);
        }else{
            $(e).find('a').attr('href',androidSrc);
        }
    }
    if(typeof callback === 'function'){
        callback();
    }
}
function ajaxFn(url,data,callback){
    $.ajax({
        url:url,
        type:'post',
        data:data,
        contentType: 'application/json;charset=UTF-8',
        dataType:'json',
        success:function (res) {
            if(res == 'SUCCESS' && typeof callback){
                callback(res);
            }
        },error:function(err){
            console.log(err);
        }
    })
}

function Browser(){
    this.u       = navigator.userAgent;
    this.app     = navigator.appVersion;
    this.trident = this.u.indexOf('Trident') > -1; //IE内核
    this.presto  = this.u.indexOf('Presto') > -1; //opera内核
    this.webKit  = this.u.indexOf('AppleWebKit') > -1; //苹果、谷歌内核
    this.gecko   = this.u.indexOf('Gecko') > -1 && this.u.indexOf('KHTML') == -1; //火狐内核
    this.mobile  = !!this.u.match(/AppleWebKit.*Mobile/i) || !!this.u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/)//是否为移动终端
    this.ios     = !!this.u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    this.android = this.u.indexOf('Android') > -1 || this.u.indexOf('Linux') > -1; //android终端或者uc浏览器
    this.iPhone  = this.u.indexOf('iPhone') > -1 || this.u.indexOf('Mac') > -1; //是否为iPhone或者QQHD浏览器
    this.iPad    = this.u.indexOf('iPad') > -1; //是否iPad
    this.webApp  = this.u.indexOf('Safari') == -1; //是否web应该程序，没有头部与底部
    this.language= (navigator.browserLanguage || navigator.language).toLowerCase();
    this.iosSchemsUrl = '';
    this.androidSchemsUrl = '';
}
Browser.prototype.is_weixin = function(){
    var ua = this.u.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
};
Browser.prototype.is_Android = function(){
    return this.android;
};
Browser.prototype.is_ios = function(){
    return this.ios || this.iPhone || this.iPad;
};
function getDateTimeStamp (dateStr) {
    return Date.parse(dateStr.replace(/-/gi,"/"));
}
function getTaskTime(strDate) {
    if(null==strDate || ""==strDate){
        return "";
    }
    var dateStr=strDate.trim().split(" ");
    var strGMT = dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[5]+" "+dateStr[3]+" GMT+0800";
    var date = new Date(Date.parse(strGMT));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;

    return y+"-"+m+"-"+d+" "+h+":"+minute+":"+second;
};
function getDateDiff (dateStr) {
    var publishTime = getDateTimeStamp(dateStr)/1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime()/1000),
        d,

        date = new Date(publishTime*1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {M = '0' + M;}
    if (D < 10) {D = '0' + D;}
    if (H < 10) {H = '0' + H;}
    if (m < 10) {m = '0' + m;}
    if (s < 10) {s = '0' + s;}

    d = timeNow - publishTime;
    d_days = parseInt(d/86400);
    d_hours = parseInt(d/3600);
    d_minutes = parseInt(d/60);
    d_seconds = parseInt(d);

    if(d_days > 0 && d_days < 3){
        return d_days + '天前';
    }else if(d_days <= 0 && d_hours > 0){
        return d_hours + '小时前';
    }else if(d_hours <= 0 && d_minutes > 0){
        return d_minutes + '分钟前';
    }else if (d_seconds < 60) {
        if (d_seconds <= 0) {
            return '刚刚发表';
        }else {
            return d_seconds + '秒前';
        }
    }else if (d_days >= 3 && d_days < 30){
        return M + '-' + D + '&nbsp;' + H + ':' + m;
    }else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    }
}
/*转GMT格式*/
function getTaskTime(strDate) {
    if(null==strDate || ""==strDate){
        return "";
    }
    var dateStr=strDate.trim().split(" ");
    var strGMT = dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[5]+" "+dateStr[3]+" GMT+0800";
    var date = new Date(Date.parse(strGMT));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;

    return y+"-"+m+"-"+d+" "+h+":"+minute+":"+second;
};
/*时间扩展
 示例：let newDay = new Date().format('yyyy-MM-dd hh:mm:ss');*/
Date.prototype.format = function(date_format) { // author: meizz
    console.log(typeof date_format,date_format);

    var o = {
        "M+" : this.getMonth() + 1, // 月份
        "d+" : this.getDate(), // 日
        "h+" : this.getHours(), // 小时
        "m+" : this.getMinutes(), // 分
        "s+" : this.getSeconds(), // 秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
        "S" : this.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(date_format))
        date_format = date_format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(date_format))
            date_format = date_format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                    .substr(("" + o[k]).length)));
    return date_format;
};

function rnd(min, max){
    return min + Math.floor(Math.random() * (max - min + 1));
}

function getMoble() {
    var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    var i = parseInt(10 * Math.random());
    var prefix = prefixArray[i];
    for (var j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    }
    return prefix;
}

function phoneNumReplace(str) {
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function stopProp(e){
    if ( e && e.stopPropagation )
//因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    else
//否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
}

var myFunction = function(){
    clearInterval(interval);
    //..your code
    interval = setInterval(myFunction, rnd(2,10) * 1000);
};
var interval = setInterval(myFunction, rnd(2,10) * 1000);