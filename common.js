//用FileReader将任何BLOB对象转换成BASE64编码
	//loadBlobToBase64(xhr.response).then(function(base64){});
var	loadBlobToBase64=function(blob){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		var reader = new FileReader();
		reader.onload = function() {
			  deferred.resolve(reader.result);
        }
       	reader.readAsDataURL(blob);
       	return promise;
	},
	xhr2=function(options){
		var that=this;
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
        var xhr = new XMLHttpRequest(),
            method = options.method || 'get';
        xhr.responseType = options.responseType ||'blob';   

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
	//getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png")
	//	.then(function(xhr){
	//得到某个文件的串列
	getArrayBuffer=function(url){
		var resourceUrl = url || "http://img1.douban.com/pics/nav/lg_main_a10.png";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', resourceUrl, true);

	    // Response type arraybuffer - XMLHttpRequest 2
	    xhr.responseType = 'arraybuffer';
	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };
	    xhr.send();
	    return promise;
	},
	//从文件最后四位得到该图像文件的大小信息
	//EXAMPLE:
	// var size=getHideFileSizeMeta(new_TypedArray.buffer.byteLength-4,new_TypedArray.buffer);		
	// console.log(size);
	getHideFileSizeMeta=function(offset,arrayBuffer){
		var dataview = new DataView(arrayBuffer);	
		var img_length= dataview.getUint32(offset);
		return img_length;
	},
	setHideFileSizeMeta=function(offset,arrayBuffer,size){
		var dataview = new DataView(arrayBuffer);
			dataview.setUint32(offset,size); 
	}
	//http://stackoverflow.com/questions/10786128/appending-arraybuffers
	//将两个buffer合并的函数
	//EXAMPLE:
	// getArrayBuffer(test_wav).then(function(wav_buffer){
	// 	getArrayBuffer("http://img1.douban.com/pics/nav/lg_main_a10.png").then(function(img_buffer){
	// 		//记录一下图像的大小以供SLICE
	// 		var new_TypedArray=appendBuffer_and_fileSizeMeta(img_buffer.response,wav_buffer.response);
	appendBuffer_and_fileSizeMeta=function ( buffer1, buffer2 ) {
  		var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength + 4);
  			tmp.set( new Uint8Array( buffer1 ), 0 );
  			tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
  			//将图像文件的大小，即偏移量信息，写入最后四位，这样以后就可以方便解析
  			var offset=buffer1.byteLength + buffer2.byteLength,
  				imgSize=buffer1.byteLength;
  				setHideFileSizeMeta(offset,tmp.buffer,imgSize);
		//返回一个Typed Array，而不是一个ArrayBuffer
  		return tmp;
	},
	//Return a buffer object
	//EXAMPLE:
	// var wav_blob=new Blob([splitWavFromImage(new_TypedArray.buffer)],{type:"audio/wav"});
	// var wav_url=window.webkitURL.createObjectURL(wav_blob);
	// 			renderPlayer(h1,wav_url);
	splitWavFromImage=function(arraybuffer){
		var size=getHideFileSizeMeta(arraybuffer.byteLength-4,arraybuffer);
		var wav_buffer=	arraybuffer.slice(size,arraybuffer.byteLength-4);
		return wav_buffer;
	},
	
	//用来测试以及调试的函数
	testDeletePostInterFace=function(){
		var data_sid='931234';
		var ck='HwkQ';
			deleteNewStatu(ck,data_sid).then(function(xhr){
					console.log(xhr);
			},function(e){
					console.log(e);
			});
	},
	//用来测试以及调试的函数
	testFormDataInterFace=function(){
		var xhr = new XMLHttpRequest();
		var f=document.getElementById('isay-upload');
		var fd = new FormData(f);
			//fd.append("test","test");
		xhr.open('POST', 'http://www.douban.com/j/status/delete', true);
	    // Transmit the form to the server
	    console.log("====testFormDataInterFace====");
	    console.log(fd);
	    console.log("====f====");
	    console.log($(f).serializeArray());
	    xhr.send(fd);

	}