var reverse_clock=null;
var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
	renderIsayTextArea=function(){
		var text_obj=$('#isay-cont');
		var text_label=$('#isay-label');
		var label=text_label.html();
			 if (label==='说点什么吧...') {
			    //为空的情况下，清空LABLE，并加入自定义字体的标签
			    	text_label.html('');
			    	text_obj.val(replace_player_holder);
			    }else{
			    //已经有内容了,则仅仅加入特殊字符标记
			    	console.log("saying is not null");
			    	var text=text_obj.val();
			    	text_obj.val(text+replace_player_holder);	
			    }	
	},
	onRecordSuccess=function(myself,stream){
		var myself=myself||$("#isay-act-field .bn-record");		
		var txt = "<audio controls autoplay>";
		console.log("Hi...I am end");
        console.log(stream);
        	var output = $(txt).appendTo("#voice-result")[0];
        		myself.prop('disabled', false);

        	var options={responseType:'blob',uri:test_wav};
				xhr2(options)
					.then(function(xhr){
				loadBlobToBase64(xhr.response)
					.then(function(base64){
			    		localStorage["VOICE_BUFFER"]=base64;
			    		renderIsayTextArea();
			    	});
				});
		myself.prop('value', "重录");
	},
	renderClock=function(myself,stream){
		//保存录音的按钮
		var myself=myself||$("#isay-act-field .bn-record");
		//设置一个倒计时
        $("#voice-result").after("<span id='voice-clock'>14</span>");
        var clock=$('#voice-clock');
        reverse_clock=setInterval(function(){
        	var time=parseInt(clock.html());
        	clock.html(time-1)
        },1000);
        //14秒钟后停止倒计时，并REMOVE钟表元素
        //todo:可以在14秒后把录音按钮写成重录...另外在录音未完结前，不显示上传按钮
        //另外考虑一下用户有可能会重复上传时的逻辑
        setTimeout(function(){        	
        	stream.stop();
        	clearInterval(reverse_clock);
        	clock.remove();
        	reverse_clock=null;
        	myself.prop('disabled', false);

        },2000);

	},
	// HTML5 voice record demo
	//http://jsfiddle.net/DerekL/JV996/
	//以后可能也需要deffered化这一段代码，返回的无非就是一段BASE64的东西就可以了
	doRecord=function(myself){
		//保存录音的按钮
		var myself=myself||$("#isay-act-field .bn-record");
	    var opt = {}, txt="";
	        opt = {video: false,audio: true};        
		    if (reverse_clock===null) {
			    navigator.webkitGetUserMedia(opt, function(stream) {
			        $("#voice-result").empty();

			        //成功获取到录音片段
			        stream.onended=function(){
			        	onRecordSuccess(myself,stream);
			        }

			        renderClock(myself,stream);
		        
			    }, function(err) {
			    	myself.prop('disabled', false);
			        console.log(err);
			        err.code == 1 && (alert("可以再次点击录音，直到你想好了为止"))
			    });
			}//end of if of reverse_clock 
	},
	renderActField=function(){
		var field="<div class='field'>",
			bd="<div class='bd'>",		
			cancel_btn="<a href='javascript:void(0);' class='bn-x isay-cancel'>×</a>",
			span_btn="<span class='bn-flat'>"+
							"<input type='button' value='录音'"+
							"class='bn-record'></span>",
			end_div="</div>",
			result="<span id='voice-result'></span>",
			name="<span id='voice-name'><p><div></div></p></span>​",
			final_html=field+bd+
							result+name+
								cancel_btn+
		                    span_btn+
		                   end_div+end_div;
		$("#isay-act-field").html(final_html);
		$("#isay-act-field .field").show();
		//取消录音
		$("#isay-act-field .isay-cancel").click(function(){
				$("#isay-act-field .field").hide();
		});
		var bn_record=$("#isay-act-field .bn-record");
		//录音	
		bn_record.click(function(){
				//把自身的指针传过去
				doRecord(bn_record);
				//防止用户猛击
				bn_record.prop('disabled', true);
		});				
	},
	renderPlayer=function(dom,base64File){
			var src=" src='"+base64File+"' ";
			var audio_tag="<audio controls "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			//$("div.mod[data-status-id='971768591'] div.bd blockquote p")
			//orgin_html.find("p").html()
			var orgin_audio=dom.find("audio");
				orgin_audio.remove();
			var org_txt=dom.html();
			var	txt="";
			//防御式编程....
			if(org_txt){
				txt=org_txt.replace(replace_player_holder,"");
			}
			//var orgin_audio=$("<p>"+audio_tag+"</p>").find("audio");
			//	orgin_audio.remove();
			dom.html(txt+audio_tag);
	},
	getFileAgain=function(Statue,user_quote_obj){
	setTimeout(function(){
		console.log("3s !!!!");
		var msg={method:"getFile",id:Statue.data_sid};
		bgFileHandler(msg).then(function(response){
			if (response.file) {
				renderPlayer(user_quote_obj,response.file);
				console.log("Ok....3s after");
			};
			if(response.error){
				console.log("3s after...fail again");
			}
		});
	},3000);
	},
	failLoadFile=function(Statue,user_quote_obj){
		//得改成有BACKGROUND来上传
		var cur_usr=getUserName();
		if(Statue.user_uid===cur_usr){
			var temp_base64=localStorage["VOICE_BUFFER"];
			console.log("I am not in remote:"+Statue.data_sid);
			localStorage["VOICE_BUFFER_ID"]=Statue.data_sid;				
			renderPlayer(user_quote_obj,temp_base64);
			//不在远端，那么就开始上传吧
			var msg={method:"setFile",
					id:Statue.data_sid,
					file:temp_base64};
			bgFileHandler(msg).then(function(response){
				if (response.returnID) {
					console.log("setSucceed..."+response.returnID);
				};
			});			
			// setFile(Statue.data_sid,temp_base64).then(function(returnID){
			// 		console.log("setSucceed..."+returnID);
			// },function(){

			// });
				//3秒钟之后再试一次
				getFileAgain(Statue,user_quote_obj);
		}else{
			//等一段时间再刷新一下吧，或者也可以自动更新
			var temp_base64=localStorage["VOICE_BUFFER"];
			renderPlayer(user_quote_obj,temp_base64);
				//3秒钟之后再试一次
				 getFileAgain(Statue,user_quote_obj);
			
		}//end of 如果不是当前用户，又没抓到，来个setTimeOut先？
	},
	initPlayer=function(){
	$("div.status-item").each(function(){
	//优化了一下，尽力少扫描些信息
	var myself=$(this);
		var data_sid=myself.attr("data-sid");
		var user_url=myself.find("div.bd p.text a:first").attr("href");	
		var user_quote=myself.find("div.bd blockquote p").html();
		var user_uid=user_url.slice(29,-1);
		var Statue={};
			Statue.data_sid=data_sid;
			Statue.user_url=user_url;
			Statue.user_quote=user_quote;
			Statue.user_uid=user_uid;
	//to render player? or not
	if(Statue.user_quote!=null){
	  var ifPlayer=(Statue.user_quote.indexOf(replace_player_holder)===-1)?false:true;
		if(ifPlayer){
			console.log("ifPlayer holder?"+ifPlayer);
			var user_quote_obj=myself.find("div.bd blockquote p");

		var msg={method:"getFile",id:Statue.data_sid};
		bgFileHandler(msg).then(function(response){
				if (response.file) {
					renderPlayer(user_quote_obj,response.file);
				};
				if(response.error){
					failLoadFile(Statue,user_quote_obj);
				}
		});
		// getFile(Statue.data_sid).then(function(base64){
		// 	renderPlayer(user_quote_obj,base64);
		// },function(){
		// 	failLoadFile(Statue,user_quote_obj);							
		// });//end of 没有得到恰当的音频文件
				
		}//end of ifplayer?
	}//end of not user quote null
		//===========================================
		});//end of each itor
	},
	initVoiceAction=function(){
		var topic=$(".ico-topic");
			topic.after("<a href='javascript:void(0);' tabindex='4'"+
						"class='ico ico-voice' data-action='voice' "+
						"style='background:"+ 
						       "url("+voice_img+") "+
								"no-repeat 0 0;'"+
					    "title='添加语音'>语音</a>");
			var voice_btn=$(".ico-voice");

			voice_btn.bind("click",function(event){				
				renderActField();
			});
			//对文件上传的两个小HACKS，一个是改变了我说未弹出前的右边距
			//这是两个HACKS，针对我们加入了自己的按钮后改变了人家原有的流程
			var file_uploder=$("#isay-upload");
				file_uploder.css({right: '72px'});
			//监听BTN-GROUP，如果长度改变了，说明db-isay展开了，加上处理的流程
			//即将右边距设置成120PX
			var btn_group=$('.btn-group');
			btn_group.bind('DOMSubtreeModified', function() {
 					var file_uploder=$("#isay-upload");
						file_uploder.css({right: '120px'});
    		
			});		
	},
	initIconFont=function(){
			var style=$("style:last");
			var css="<style type='text/css'>"+
					"@font-face {font-family:"+
			    	"'RaphaelIcons';"+
			    	"src:"+
			    	"local('☺'),url('"+raphaelicons+"') format('svg');"+
			    	"font-weight: normal;"+
			    	"font-style: normal;}"+
			    	".voice_say {font-family: 'RaphaelIcons';font-size: 18px;}"+
					"</style>";
			style.after(css);
			var testText="<p class='voice_say'>ÜÜÜÜÜÜÜ</>";
			$("h1:first").after(testText);
	},
	bgFileHandler=function(msg){
		var msg=msg||{method: 'heartBeat'};
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
		chrome.extension
			  .sendMessage(msg, function(response) {
			  		deferred.resolve(response);
			});
		return promise;
	},
	testGAE=function(){		
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
				deferred.resolve(xhr.response);
	        }
	    }

	    xhr.open('POST', 'http://localhost:8080/', true);

	    xhr.send(fd);

	    return promise;

	};