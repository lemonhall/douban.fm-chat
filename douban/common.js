var socket = io.connect('http://localhost:9000');

var bubbler_song_info=localStorage['bubbler_song_info'];
	bubbler_song_info=JSON.parse(bubbler_song_info);

console.log(bubbler_song_info);
var mine_profile={};




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
		//缓存策略
		//TODO:带上时间戳，让缓存别那么傻，另外边界条件也得好好检查
		//console.log(localStorage['douban_mine_profile']);
		if (localStorage['douban_mine_profile']) {
			var temp=localStorage.getItem('douban_mine_profile');
			//全局变量
			mine_profile=JSON.parse(temp);
			console.log(mine_profile);
		}else{
		__getUserProfile().then(function(xhr){
			console.log(xhr);
			var usr_profile=$(xhr.response).find("#db-usr-profile");
			var usr_href=$(usr_profile).find("a:first");
			var usr_avtor=$(usr_profile).find("img");
			var usr_id=usr_href.attr("href");
			var usr_img=usr_avtor.attr("src");
			var my_profile={};
				my_profile.usr_id=usr_id;
				my_profile.usr_img=usr_img;
			//全局变量
			mine_profile=my_profile;
			console.log(usr_profile);
			console.log(usr_href.attr("href"));
			console.log(usr_avtor.attr("src"));

			//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  			localStorage.setItem('douban_mine_profile', JSON.stringify(my_profile));
  		});//END of __getUserProfile()

		}//END of else

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
	init_chat_window=function(){

		//初始化UI界面
		init_ui();


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

	//接受新消息的逻辑部分
	socket.on("new_message",function(data){
			console.log(data);
			var message=data.message;
			var avtor=data.avtor;

			chat_content.append("<div class='bubble you'>"+message+"&nbsp;&nbsp;<img src="+avtor+"></div>");
			var t=$("#chat_content")[0];
			t.scrollTop = t.scrollHeight;
	});


};

var router=function(){
		getUserProfile();
		init_chat_window();
};//END of router()


//程序入口
router();