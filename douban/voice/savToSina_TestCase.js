(function () {
	var id="test";
	var base64="base64";
	var getFile=save.savToSina.getFile;
	var setFile=save.savToSina.setFile;
	//其实很简单，设置一个文件，期待正确的结果
	setFile(id,base64).then(function(r1){
				console.log(r1);
			getFile(id).then(function(base64){
				console.log(base64);
			},function(e){
				console.log(e);
			});
	},function(e){
				console.log(e);
	});
})();