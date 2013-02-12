var socket = io.connect('http://localhost:9000');

var bubbler_song_info=localStorage['bubbler_song_info'];
	bubbler_song_info=JSON.parse(bubbler_song_info);

console.log(bubbler_song_info);




var init_chat_window=function(){
	var fm_sidebar=$("#fm-sidebar");
	var chat_sidebar="<div id='chat-sidebar' style='position: absolute;top: 0;left: 26px;width: 26px;height: 100%;background: #fff;z-index: 888;-webkit-box-shadow: 10px 0 10px 0 rgba(0,0,0,0.1);box-shadow: 10px 0 10px 0 rgba(0,0,0,0.1);overflow: hidden;'>";
	var chat_side_inner="<div class='chat-side-inner' style='margin:26px;'><div id='chat_content' style='left:20px;height:600px;width:400px;border:1px;'></div><br>"+
		"<textarea type='text' id='chat_box'></textarea>"+
		"</div>";
	var chat_side_ctrl="<div class='chat-sidectrl chat-ctrlline'><div id='chat-sidebar-ctrl' title='收起聊天栏' data-opt_title='收起聊天栏'></div></div>";

	var html=chat_sidebar+chat_side_inner+chat_side_ctrl+"</div>";

	fm_sidebar.after(html);

	//打开和关闭的滑动效果，倒是可以抄袭一下
	var chat_side_ctrl_btn=$("#chat-sidebar");
	var chat_content=$("#chat_content");
	var chat_box=$("#chat_box");

	chat_box.click(function(event){
		event.stopPropagation();

	});

	chat_box.keydown(function(event){
    	if( event.keyCode == 13 ){
        	var message=$(this).val();

        	chat_content.append("<div class='bubble me'><img src='http://img3.douban.com/icon/u55895127-24.jpg' alt='柠檬'>&nbsp;&nbsp;"+message+"</div>");
        	socket.emit('message',message);
        	$(this).val("");
        }
	});

	socket.on("new_message",function(data){
			console.log(data);
			chat_content.append("<div class='bubble you'>"+data+"&nbsp;&nbsp;<img src='http://img3.douban.com/icon/u4080075-12.jpg'></div>");
	});

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
};

var router=function(){
		init_chat_window();

};

router();