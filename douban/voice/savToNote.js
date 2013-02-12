(function () {

var savToNote = (function(){
	//删除一个对应的广播SID
	var	__deleteNewStatu=function(ck,data_sid){
		var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var f=document.getElementsByName('mbform');
	    var fd = new FormData();    
			fd.append('sid', data_sid);
	    	fd.append('ck', ck);

	    xhr.open('POST', 'http://www.douban.com/j/status/delete', true);

	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

	    // Transmit the form to the server
	    xhr.send(fd);
	    console.log(fd);
	    return promise;

	},
	__scanNewNote=function(){
		//构造并找到新的日记的ID
		var debug=2;
		var temp_note_id=localStorage["temp_note_id"];
		var new_note_url="http://www.douban.com/note/"+temp_note_id+"/";
		var ref=$("a[href='"+new_note_url+"']");
		var statu=ref.parent().parent().parent().parent();

		//得到两个需要向POST提交的参数
		var data_sid=statu.attr("data-sid");
		var ck=$("input[name='ck']").attr("value");
		if(debug===1){
			console.log(ck);
			console.log(data_sid);
		}
		//如果不为undefined则开始删除工作
		if (data_sid!=undefined) {
			__deleteNewStatu(ck,data_sid).then(function(xhr){
					console.log(xhr);
			},function(e){
					console.log(e);
			});

		};
		//var del=ref.parent().parent().find(".btn-action-reply-delete");
		//todo:找到日记，得到SID，构造FORM DATA，执行删除
		//并执行HIDE...（因为没有刷新什么的，必须我来手动执行隐藏）
		//del.trigger('click')
		// Request URL:http://www.douban.com/j/status/delete
		// Request Method:POST
		// Status Code:200 OK
		// Request Headersview source
		// Accept:text/plain, *; q=0.01
		// Accept-Charset:UTF-8,*;q=0.5
		// Accept-Encoding:gzip,deflate,sdch
		// Accept-Language:zh-CN,zh;q=0.8
		// Connection:keep-alive
		// Content-Length:21
		// Content-Type:application/x-www-form-urlencoded
		// Cookie:bid="UxnM1mg/5v0"; dbcl2="55895127:HF2B9NoPKEI"; ck="HwkQ"; ct=y; __utma=30149280.2077510121.1342357707.1342357707.1342357707.1; __utmb=30149280.458.10.1342357707; __utmc=30149280; __utmz=30149280.1342357707.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=30149280.5589
		// Host:www.douban.com
		// Origin:http://www.douban.com
		// Referer:http://www.douban.com/update/?p=2
		// User-Agent:Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
		// X-Requested-With:XMLHttpRequest
		// Form Dataview URL encoded
		// sid:969282745
		// ck:HwkQ

	},
	// Example:
	// getFileFromNote().then(function(xhr){
	// 		console.log(xhr.response);
	// });
	__getFileFromNote=function(){
		var note='http://www.douban.com/note/225350522/';
		var options={responseType:'document',uri:note};
		var that=this;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
        var xhr = new XMLHttpRequest(),
            method = options.method || 'get';
        xhr.responseType = options.responseType ||'document';   

		xhr.onload = function() {
			deferred.resolve(xhr);
		};

        xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }
    
        xhr.open(method, options.uri);
        xhr.send();
    
        //xhr.send((options.data) ? urlstringify(options.data) : null);

		return promise;
	},
	__redirectToNote=function(wavLocalStorageID){
		location.href="http://www.douban.com/note/create/?voice=true"+"&id="+wavLocalStorageID;
	}
//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	initView:function(){
		__scanNewNote();
	},
	//依靠日记来保存数据的原型
	//这应该是向外暴露的公共方法
	uploadToServer:function(wavLocalStorageID){
		//将WAV数据存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
		//redirectTo createNote.js
		__redirectToNote(wavLocalStorageID);
	}
};
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savToNote)
		save.savToNote = savToNote;

})();