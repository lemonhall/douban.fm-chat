(function () {	
var savToSina = (function(){
	//依靠自己的服务器来保存数据的原型
var __saveToCache=VoiceCache.setCache;
var __getFromCache=VoiceCache.getCache;
var __ifExistIncache=VoiceCache.ifExistIncache;

var	__setSina=function(id,base64){
		var id=id||"1234567";
		var base64=base64||"base64";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var xhr = new XMLHttpRequest();

		var fd = new FormData();
			fd.append("method","SET");
			fd.append("id",id);		
			fd.append("base64",base64);

		xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            var data=JSON.parse(xhr.response);
				//如果正确直接返回数据
				if(data.err_msg===""){
					deferred.resolve(data.id);
					//console.log(xhr);
				}
				if(data.err_msg==="key设置失败"){
					deferred.reject(xhr,"key设置失败");
				}	
	        }
	    };

		xhr.open('POST', 'http://1.lemonvoice.sinaapp.com/', true);

	    xhr.send(fd);

	    return promise;

	},
	__getSina=function(id){
		var id=id||"1234567";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		var xhr = new XMLHttpRequest();

		var fd = new FormData();
			fd.append("method","GET");
			fd.append("id",id);		
			//fd.append("base64","base64");

		xhr.onerror = function(e) {
				deferred.reject(xhr,e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
		        var data=JSON.parse(xhr.response);
		        console.log(xhr);
				//如果正确直接返回数据
				if(data.err_msg===""){
					deferred.resolve(data.base64);
				}
				if(data.err_msg==="无此键值"){
					deferred.reject(xhr,"无此键值");
				}	            
	        }
	    };

		xhr.open('POST', 'http://1.lemonvoice.sinaapp.com/', true);

	    xhr.send(fd);

	    return promise;

	},
	__setFile=function(id,base64){
		var id=id||"voice_test_id";
		var base64=base64||"base64";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		__ifExistIncache(id).then(function(cacheExist){
			//DoNothing....
			//这里有待解决，应该可以使用MD5或其他方式来防止重复提交
				__saveToCache(id,base64).then(function(){
					deferred.resolve(id);
				},function(){
					deferred.reject();
				});
		},function(e){
				__setSina(id,base64).then(function(returnID){
					__saveToCache(id,base64).then(function(){
						deferred.resolve(returnID);
					},function(){
						deferred.reject();
					});
				},function(){
						deferred.reject();
				});
		});
		return promise;
	},
	//传入id，得到文件
	__getFile=function(id){
		var id=id||"voice_test_id";
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		
		__ifExistIncache(id).then(function(cacheExist){
		console.log("id:"+ id + "_cacheExist?"+cacheExist);
			__getFromCache(id).then(function(base64){
				deferred.resolve(base64);
			},function(){
				deferred.reject();
			});
		},function(e){
		console.log("id:"+ id + "_cacheExist? "+e);
		//=====================================
			__getSina(id).then(function(base64File1){
				//console.log("__getSina(id)_id?"+id);
				//console.log("__getSina(id)_base64File1?"+base64File1);
				__saveToCache(id,base64File1).then(function(){
					//console.log("__saveToCache(id)id?"+id);
					deferred.resolve(base64File1);
				},function(){
					deferred.reject();
				});
			},function(){					
				deferred.reject();
			});
		});
			
		return promise;
	}

//公共接口
return {
	//向外暴露的公共方法，构造完成后，扫描DOUBAN UPDATE时调用这个函数
	//EXAMPLE:
	// var getFile=save.savToSina.getFile;
	// getFile("1234567").then(function(base64){
	// 		console.log(base64);
	// });
	getFile:function(id){
		return __getFile(id);
	},
	setFile:function(id,base64){
		return __setFile(id,base64);
	}
};//END of 公共接口
})();

// 将模块注册到WINDOWS对象上去
	if(!save.savToSina)
		save.savToSina = savToSina;

})();