(function () {

var savTodoubanImgServer = (function(){
//上传至豆瓣，使用了自定义的方式来组建FORM。。。
//
var	__uploadImg=function (file) {

	    var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");

	    var fd = new FormData();
		    //先传递钥匙过去
		    fd.append('ck', ck);
		    //再传递一个name=image的arrayBuffer过去
		    fd.append('image', file);
	    xhr.open('POST', 'http://www.douban.com/j/upload', true);

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

	    return promise;
	    //http://img3.douban.com/view/status/small/public/2e9e707ab7aee90.jpg
	    //http://img3.douban.com/view/status/raw/public/2e9e707ab7aee90.jpg
	},
	//简单替换字符串得到实际的RAW地址
	//EXAMPLE:
	// var rawImg=__getRawUrl("http://img3.douban.com/view/status/small/public/39bf2861338e7cc.jpg");
	// 		console.log(rawImg);
	__getRawUrl=function(smallUrl){
		//TODO:consider img1???
		var img_url=smallUrl;
		var new_url=img_url.replace('http://img3.douban.com/view/status/small/public/','http://img3.douban.com/view/status/raw/public/');
		return new_url;
	},
	__UploadToIsay=function(small_url,comments){
		var comments=comments||'test';
		var xhr = new XMLHttpRequest();
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");		
		var fd = new FormData();

			fd.append("ck",ck);
			fd.append("comment",comments);			
			fd.append("uploaded",small_url);

		xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

		xhr.open('POST', 'http://www.douban.com/update/', true);
	    xhr.send(fd);

	    return promise;

	}
//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	initView:function(){


	},
	//依靠日记来保存数据的原型
	//这应该是向外暴露的公共方法
	uploadToServer:function(file,say){
		//console.log(file);
		//console.log(say);
			//将图像上传到服务器
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
			__uploadImg(file)
			.then(function(xhr){
				var img=JSON.parse(xhr.responseText);
		
				var rawImg=__getRawUrl(img.url);
					//上传到服务器之后，再上传到我说的服务接口上去
					__UploadToIsay(img.url,say)
					.then(function(xhr){
							console.log("完成");
							deferred.resolve(xhr);
					},function(e){
						console.log("uploadToImgServer:uploadToServer上传Isay时报错.");
						deferred.reject(e);
					});//END OF 上传到我说			
			},function(e){
				console.log("uploadToImgServer:uploadToServer上传图像时报错.");
						deferred.reject(e);
			});
		return promise;
	}//uploadToServer end
};//pulic method exports end
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savTodoubanImgServer)
		save.savTodoubanImgServer = savTodoubanImgServer;	
})();