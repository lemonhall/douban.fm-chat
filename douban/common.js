
var DEBUG=true;
var socket=null;

var mine_profile={};
var gbubbler_song_info=localStorage['bubbler_song_info'];
	gbubbler_song_info=JSON.parse(gbubbler_song_info);

var join_room=function(){
//复杂版本的，需要在服务器做很多动作
//socket.emit("join_room",{room:gbubbler_song_info.channel,url:mine_profile.usr_id,avtor:mine_profile.usr_img});
// var regUsr=function(data,uuid){
//     var usr={};
//     var usr.url=data.url;
//     var usr.img=data.img;
//     var usr.room=data.room;
//     var usr.name=data.name;

//     users[uuid]=usr;

// };
		if(gbubbler_song_info.channel=="私人兆赫" || gbubbler_song_info.channel=="红心兆赫"){
				//私人兆赫与红心兆赫，do nothing
				//用户一直就在大厅
				console.log("私人和红心兆赫不响应任何房间请求");
		}else{
			var join_reg_msg={};
				join_reg_msg.room=gbubbler_song_info.channel||"";
				join_reg_msg.url=mine_profile.usr_id||"";
				join_reg_msg.img=mine_profile.usr_img||"";
				join_reg_msg.name=mine_profile.name||"";

			//简单版本的，几乎无验证这类的事情
			socket.emit("join_room",join_reg_msg);
		}		


};//End of join_room function

//启动后5秒自动加入某个兆赫
setTimeout(function(){
			join_room();
},5000);

//检查兆赫切换以及JOIN ROOM的逻辑部分
setInterval(function(){
	var bubbler_song_info=localStorage['bubbler_song_info'];
		bubbler_song_info=JSON.parse(bubbler_song_info);

	if(bubbler_song_info.channel!=gbubbler_song_info.channel){
		console.log("channel changed:"+bubbler_song_info.channel);
		gbubbler_song_info=bubbler_song_info;

		join_room();
		
	}//end of 判断是否产生变化
},5000);


var __getServerAddress=function(){
		//console.log("I am getting the user profile~~~");
		var mine='http://www.douban.com/note/262277737/';
		var options={responseType:'document',uri:mine};
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
	verifyServerAddress=function(IP){
		var re=/http/;
		return re.test(IP);
	},
	getServerAddress=function(){
		//缓存策略
		//TODO:带上时间戳，让缓存别那么傻，另外边界条件也得好好检查
		//console.log(localStorage['douban_mine_profile']);
		var deferred = $.Deferred(); 
		var promise = deferred.promise();

		__getServerAddress().then(function(xhr){
			//console.log(xhr);
			var div=$(xhr.response).find("#link-report");
			var serverAddress_a=$(div).find("a:first");
			var serverAddress=serverAddress_a[0].href;

			if (verifyServerAddress(serverAddress)) {
				//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  				//localStorage.setItem('fmchat_serverAddress', serverAddress);
				deferred.resolve(serverAddress);
			}else{
				deferred.reject("fail to get a verifyed ServerAddress..");
			}
			//console.log(serverAddress);


  		});//END of getServerAddress()

		return promise;
	},
	init_connection=function(){
		getServerAddress().then(function(address){
			try{
				if(DEBUG){
					socket= io.connect("http://localhost:9000/");
				}else{
					socket= io.connect(address);
				}
			}catch(e){
				console.log(e);
			}			

			//接受新消息的逻辑部分
			socket.on("new_message",function(data){
					console.log(data);
					var chat_content=$("#chat_content");
					var message=data.message;
					var avtor=data.avtor;
					if(avtor==mine_profile.usr_img){
							//Do nothing......
							console.log("message from myself");
					}else{
					chat_content.append("<div class='bubble you'>"+message+"&nbsp;&nbsp;<img src="+avtor+"></div>");
						var t=$("#chat_content")[0];
						t.scrollTop = t.scrollHeight;
					}

			});



		},function(e){
			console.log(e);
			localStorage.setItem('fmchat_serverAddress', "");
			// setTimeout(function(){
			// 	init_connection();
			// },5000);
		});
	};



var __getUserProfile=function(){
		//console.log("I am getting the user profile~~~");
		var mine='http://www.douban.com/mine/';
		var options={responseType:'document',uri:mine};
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
	getUserProfile=function(){
		__getUserProfile().then(function(xhr){
			console.log(xhr);
			var usr_profile=$(xhr.response).find("#db-usr-profile");
			var usr_href=$(usr_profile).find("a:first");
			var usr_avtor=$(usr_profile).find("img");
			var usr_id=usr_href.attr("href");
			var usr_img=usr_avtor.attr("src");
			var usr_name=usr_avtor.attr("alt");

			var my_profile={};
				my_profile.usr_id=usr_id;
				my_profile.usr_img=usr_img;
				my_profile.name=usr_name;

			//全局变量
			mine_profile=my_profile;
			console.log(usr_profile);
			console.log(usr_href.attr("href"));
			console.log(usr_avtor.attr("src"));
  		});//END of __getUserProfile()

	},
	init_ui=function(){

	var fm_sidebar=$("#fm-sidebar");
	var chat_sidebar="<div id='chat-sidebar' style='position: absolute;top: 0;left: 26px;width: 26px;height: 100%;background: #fff;z-index: 888;-webkit-box-shadow: 10px 0 10px 0 rgba(0,0,0,0.1);box-shadow: 10px 0 10px 0 rgba(0,0,0,0.1);overflow: hidden;'>";
	var chat_side_inner="<div class='chat-side-inner' style='margin:26px;'><div id='chat_content' style=''></div><br>"+
		"<textarea type='text' id='chat_box'></textarea>"+
		"</div>";
	var chat_side_ctrl="<div class='chat-sidectrl chat-ctrlline'><div id='chat-sidebar-ctrl' title='收起聊天栏' data-opt_title='收起聊天栏'></div></div>";

	var html=chat_sidebar+chat_side_inner+chat_side_ctrl+"</div>";

	fm_sidebar.after(html);

	//打开和关闭的滑动效果，倒是可以抄袭一下
	var chat_side_ctrl_btn=$("#chat-sidebar");
	chat_side_ctrl_btn.click(function(){
		var sidebar_class=$("#chat-sidebar").attr("class");
		//console.log(sidebar_class);
		if(sidebar_class=="close" || sidebar_class==undefined || sidebar_class==""){
			$("#chat-sidebar").animate({width: 474}, 500, function() {
	                $("#chat-sidebar").toggleClass("open");
	        });
        }
        if (sidebar_class=="open") {
			$("#chat-sidebar").animate({width: 26}, 500, function() {
	                $("#chat-sidebar").toggleClass("open");
	        });        	
        };
	});

	},
	addMessageToBoard=function(){

	},
	init_chat_window=function(){
	var chat_content=$("#chat_content");
	var chat_box=$("#chat_box");

	//输入并显示的逻辑
	chat_box.click(function(event){
		event.stopPropagation();

	});

	chat_box.keydown(function(event){
    	if( event.keyCode == 13 ){
        	var message=$(this).val();
        	var msg={message:message,avtor:mine_profile.usr_img};

        	chat_content.append("<div class='bubble me'><img src="+mine_profile.usr_img+">&nbsp;&nbsp;"+message+"</div>");
        	socket.emit('message',msg);

			var t=$("#chat_content")[0];
			t.scrollTop = t.scrollHeight;

        	$(this).val("");
        }
	});

};

var router=function(){

		getUserProfile();
		//初始化UI界面
		init_ui();
		//初始化ws链接，如果链接有问题，则使输入框不可用
		init_connection();
		init_chat_window();

		


};//END of router()


//程序入口
router();