(function () {
	var id="test";
	var base64="testBase64";
	var setCache=VoiceCache.setCache;
	var getCache=VoiceCache.getCache;
	//其实很简单，设置一个文件，期待正确的结果
	setCache(id,base64).then(function(r1){
					console.log(r1);
			getCache(id).then(function(r2){
					var result=r2.rows.item(0);
					console.log(result.base64);
			},function(e){
					console.log(e);
			});
	},function(e){
		console.log(e);
	});
})();