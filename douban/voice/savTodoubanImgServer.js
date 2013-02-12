(function () {

var savTodoubanImgServer = (function(){
//上传至豆瓣，使用了自定义的方式来组建FORM。。。
//
var	__uploadImg=function (arrayBuffer) {
// Request URL:http://www.douban.com/j/upload
// Request Method:POST
// Status Code:200 OK
// Request Headersview source
// Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8
// Accept-Charset:UTF-8,*;q=0.5
// Accept-Encoding:gzip,deflate,sdch
// Accept-Language:zh-CN,zh;q=0.8
// Cache-Control:max-age=0
// Connection:keep-alive
// Content-Length:149884
// Content-Type:multipart/form-data; boundary=----WebKitFormBoundary5US7mCZXN7ecSiNt
// Cookie:bid="UxnM1mg/5v0"; dbcl2="55895127:HF2B9NoPKEI"; ct=y; ck="HwkQ"; __utma=30149280.2077510121.1342357707.1342357707.1342401260.2; __utmb=30149280.298.10.1342401260; __utmc=30149280; __utmz=30149280.1342357707.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=30149280.5589
// Host:www.douban.com
// Origin:http://www.douban.com
// Referer:http://www.douban.com/update/
// User-Agent:Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
// Request Payload
// ------WebKitFormBoundary5US7mCZXN7ecSiNt
// Content-Disposition: form-data; name="ck"
// HwkQ
// ------WebKitFormBoundary5US7mCZXN7ecSiNt
// Content-Disposition: form-data; name="image"; filename="hideData.png"
// Content-Type: image/png
// ------WebKitFormBoundary5US7mCZXN7ecSiNt--
	    var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");

	    var fd = new FormData();
		    //先传递钥匙过去
		    fd.append('ck', ck);
		    //再传递一个name=image的arrayBuffer过去
		    fd.append('image', arrayBuffer);
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
	//从文件最后四位得到该图像文件的大小信息
	//EXAMPLE:
	// var size=__getHideFileSizeMeta(new_TypedArray.buffer.byteLength-4,new_TypedArray.buffer);		
	// console.log(size);
	__getHideFileSizeMeta=function(offset,arrayBuffer){
		var dataview = new DataView(arrayBuffer);	
		var img_length= dataview.getUint32(offset);
		return img_length;
	},
	__setHideFileSizeMeta=function(offset,arrayBuffer,size){
		var dataview = new DataView(arrayBuffer);
			dataview.setUint32(offset,size); 
	}
	//http://stackoverflow.com/questions/10786128/appending-arraybuffers
	//将两个buffer合并的函数
	//EXAMPLE:
	// getArrayBuffer(test_wav).then(function(wav_buffer){
	// 	getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png").then(function(img_buffer){
	// 		//记录一下图像的大小以供SLICE
	// 		var new_TypedArray=__appendBuffer_and_fileSizeMeta(img_buffer.response,wav_buffer.response);
	__appendBuffer_and_fileSizeMeta=function ( buffer1, buffer2 ) {
  		var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength + 4);
  			tmp.set( new Uint8Array( buffer1 ), 0 );
  			tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
  			//将图像文件的大小，即偏移量信息，写入最后四位，这样以后就可以方便解析
  			var offset=buffer1.byteLength + buffer2.byteLength,
  				imgSize=buffer1.byteLength;
  				__setHideFileSizeMeta(offset,tmp.buffer,imgSize);
		//返回一个Typed Array，而不是一个ArrayBuffer
  		return tmp;
	},
	//Return a buffer object
	//EXAMPLE:
	// var wav_blob=new Blob([__splitWavFromImage(new_TypedArray.buffer)],{type:"audio/wav"});
	// var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	__splitWavFromImage=function(arraybuffer){
		var size=__getHideFileSizeMeta(arraybuffer.byteLength-4,arraybuffer);
		var wav_buffer=	arraybuffer.slice(size,arraybuffer.byteLength-4);
		return wav_buffer;
	},
	//依靠图像来走上传之路的原型，主要就是个流程
	__uploadToImgServer=function(){
		//混合已知数据
		__hideDataIntoImage().then(function(new_buffer){
			//将混合数据上传到服务器
			__uploadImg(new_buffer).then(function(xhr){
					var img=JSON.parse(xhr.responseText);
					var rawImg=__getRawUrl(img.url);
				});

		});
		//分解出WAV数据，并存入LOCAL_STORAGE，或者WEBSQL，成为缓存数据
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
	//异步得将两种数据柔和在一起，并返回
	//
	//EXAMPLE:
	// __hideDataIntoImage().then(function(new_buffer){
	// 		//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// 		var blob = new Blob([new_buffer], { type: "image/png" });
	// 		var url = window.webkitURL.createObjectURL(blob);
	// 		var h1=$("h1:first");
	// 			__renderImg(h1,url);
	// 		var wav_blob=new Blob([__splitWavFromImage(new_buffer)],{type:"audio/wav"});
	// 		var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	// 	});
	__hideDataIntoImage=function(imgArrayBuffer,wavArrayBuffer){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		getArrayBuffer(test_wav).then(function(wav_buffer){
				var new_TypedArray=__appendBuffer_and_fileSizeMeta(imgArrayBuffer,wav_buffer.response);
				deferred.resolve(new_TypedArray.buffer);
		});
		return promise;
	},
	//__hideDataIntoImage的测试？或者说是EXAMPLE都可以
	__testDataHided=function(){
		__hideDataIntoImage().then(function(new_buffer){
			//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
			var blob = new Blob([new_buffer], { type: "image/png" });
			var url = window.webkitURL.createObjectURL(blob);
			var h1=$("h1:first");
				__renderImg(h1,url);
			var wav_blob=new Blob([__splitWavFromImage(new_buffer)],{type:"audio/wav"});
			var wav_url=window.webkitURL.createObjectURL(wav_blob);
				renderPlayer(h1,wav_url);
		});
	},
	__UploadToIsay=function(small_url,comments){
		var comments='test'||comments;
		var xhr = new XMLHttpRequest();
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var ck=$("input[name='ck']").attr("value");		
		var fd = new FormData();

			fd.append("ck",ck);
			fd.append("comment","test");			
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

	},
	//送入一个文件URL，得到串列，上传至豆瓣的POST接口，得到返回的值
	//然后对返回值进行计算，得到RAW DATA的图像地址
	//调用了getArrayBuffer以及__uploadImg
	__upload_xhr2=function(){
		//STEP 1
		getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
		.then(function(xhr){

		//STEP2
			__uploadImg(xhr.response)
			.then(function(xhr){
				var img=JSON.parse(xhr.responseText);
		//STEP3
				var rawImg=__getRawUrl(img.url);
					__UploadToIsay(img.url)
					.then(function(xhr){

					});				
			});
		});
	},
	//用来测试以及调试的函数
	testUploadIsay=function(){
// Request URL:http://www.douban.com/update/
// Request Method:POST
// Status Code:302 Moved Temporarily
// Request Headersview source
// Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
// Accept-Charset:UTF-8,*;q=0.5
// Accept-Encoding:gzip,deflate,sdch
// Accept-Language:zh-CN,zh;q=0.8
// Cache-Control:max-age=0
// Connection:keep-alive
// Content-Length:110
// Content-Type:application/x-www-form-urlencoded
// Cookie:bid="UxnM1mg/5v0"; dbcl2="55895127:HF2B9NoPKEI"; ct=y; ck="HwkQ"; __utma=30149280.2077510121.1342357707.1342425298.1342487434.6; __utmb=30149280.28.10.1342487434; __utmc=30149280; __utmz=30149280.1342357707.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=30149280.5589
// Host:www.douban.com
// Origin:http://www.douban.com
// Referer:http://www.douban.com/update/
// User-Agent:Mozilla/5.0 (Windows NT 5.2) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
// Form Dataview URL encoded
// ck:HwkQ
// comment:d
// uploaded:http://img3.douban.com/view/status/small/public/0985bd1763914f8.jpg
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
			fd.append("ck","HwkQ");
			fd.append("comment","d");			
			fd.append("uploaded","http://img3.douban.com/view/status/small/public/0985bd1763914f8.jpg");


		xhr.open('POST', 'http://www.douban.com/update/', true);
	    // Transmit the form to the server
	    console.log("====testFormDataInterFace====");
	    console.log(fd);
	    xhr.send(fd);

	},	
	//EXAMPLE:
	//原来如此，Blob的入口参数是一个被[]起来的ArrayBuffer的数组就可以了
	// var blob = new Blob([new_TypedArray.buffer], { type: "image/png" });
	// var url = window.webkitURL.createObjectURL(blob);
	// var h1=$("h1:first");
	// 	__renderImg(h1,url);
	__renderImg=function(dom,base64File){
		var src=" src='"+base64File+"' ";
			var img_tag="<img "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.after(img_tag);

	}
//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	initView:function(){


	},
	//依靠日记来保存数据的原型
	//这应该是向外暴露的公共方法
	uploadToServer:function(wavArrayBuffer){
		//STEP 1==>Get Random pic address
		getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
		.then(function(xhr){
		//混合已知数据
		__hideDataIntoImage(xhr.response,wavArrayBuffer)
		.then(function(new_buffer){
			//将混合数据上传到服务器
			__uploadImg(new_buffer)
			.then(function(xhr){
				var img=JSON.parse(xhr.responseText);
		
				var rawImg=__getRawUrl(img.url);
					//上传到服务器之后，再上传到我说的服务接口上去
					__UploadToIsay(img.url,"TEST")
					.then(function(xhr){
							console.log("完成");
					},function(e){
						console.log("uploadToImgServer:uploadToServer上传Isay时报错.");
					});//END OF 上传到我说			
			},function(e){
				console.log("uploadToImgServer:uploadToServer上传混合数据时报错.");
			});//END OF 将混合数据上传到服务器
		},function(e){
			console.log("uploadToImgServer:uploadToServer混合数据出错.");
		});//END OF 混合已知数据
		},function(e){
			console.log("uploadToImgServer:uploadToServer取得图片时出错.");
		});//END OF 得到待混合图像的ArrayBuffer数据
	}//uploadToServer end
};//pulic method exports end
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savTodoubanImgServer)
		save.savTodoubanImgServer = savTodoubanImgServer;	
})();