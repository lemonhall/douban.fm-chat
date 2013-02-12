
	//1、判断文件大小是否过大。2、粘贴到一个新的DIV里面去。3、得到高宽，并使用缩略法缩略
	//4、如果以上都符合，则上传之....5、建立我说层显示缩略图像。6、等待用户键入
	//TODO：1、在CLIENT端，将过大的文件缩放的能力？这个其实不是很紧要
	//		2、看一下怎样才能搞定由操作系统来的文件。。。
	var init_pixastic=function(){
		var clipboard_div=$("#clipboard");
		var clipboard_img=$("#myClipboardimg");
		clipboard_img.bind("click",function(){
			$(this).pixastic("desaturate");
		});
	},
	init_uploadView=function(file){
		var clipboard_div=$("#clipboard");
		var clipboard_img=$("#myClipboardimg");
		$("#db-isay #isay-submit").hide();
		$("#db-isay .btn-group").hide();
		//<input id="isay-submit" tabindex="1" type="submit" value="我说">
		$("#db-isay #isay-submit").after("<input id='my-isay-img-submit' tabindex='1' type='' value='哈哈哈'>");
		$("#my-isay-img-submit").show();
		$("#my-isay-img-submit").bind("click",function(){
				var say=$("#isay-cont").val();
				if(say){
					upload_toServer(file,say);
				}
		});
		//upload_toServer(file);
	},
	upload_toServer=function(file,comments){
		//取得模块
		var upload=save.savTodoubanImgServer.uploadToServer;
			upload(file,comments).then(function(xhr){
				window.location.reload();
			});

	},
	init_pasteAPI=function(){
		var w=$(window);
			$("h1").after("<div id='clipboard'></div>");
		var clipboard_div=$("#clipboard"); 	
		w.bind("paste",function(e){
				var items=e.originalEvent.clipboardData.items;
				for(var i=0;i<items.length;i++){
					var item=items[i];
					console.log(item);
					if(/image/.test(item.type)){
						var file = item.getAsFile();
						console.log(file);
						var url=window.webkitURL.createObjectURL(file);
						clipboard_div.html("<img id='myClipboardimg' src='"+url+"'>");
						init_uploadView(file);						
					}			
				}
		});

	};