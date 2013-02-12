//http://www.douban.com/note/create?voice=true
(function(){

var debug=2;
var urlParams = {};
	var debug=2;
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();

var url_slice=location.href.slice(0,33);
var ifupdate_url=url_slice==="http://www.douban.com/note/create";

var	renderPlayer=function(dom,base64File){
			var src=" src='"+base64File+"' ";
			var audio_tag="<audio autoplay controls "+ 
							src+
							//"id=audio_"+
							//Statue.data_sid+
							">";
			dom.html(audio_tag);
	},
	initNote = function (){
		// $(".top-nav").hide();
		// $("#header").hide();
		// $("#footer").hide();
		var note_id=$("#note_id");

		var h1=$("h1:first");
			h1.html("保存语音");
			h1.hide();
		var	row_note_title=$(".note-title");
			row_note_title.hide();
		var publish_note=$('#publish_note');
		var title=$('#note_title');
			title.val("test");
		var content=$('#note_text');
			content.hide();
			content.html("audio_src");
		var row_note_text=$('.note-text');
			row_note_text.hide();
		var row_note_privacy=$('.note-privacy');
			row_note_privacy.hide();
		var cannot_reply=$("#cannot_reply");
			cannot_reply.prop("checked", true);
		var row_note_reply=$(".note-reply");
			row_note_reply.hide();		
		publish_note.after("<span id='voice_player'></span>");

		$('#preview_note').parent().hide();
		$('#cancel_note').hide();

		var	player=$('#voice_player');
		renderPlayer(player,test_wav);

		localStorage["temp_note_id"]=note_id.prop("value");
			//TODO:接下来将转换得到的TMP WAV BASE64字符，直接存入日记
			//得到BASE64的内容
			//content.html(base64);
			//保存成功之后，会到刚才写好的日记那里去，那个时候
			//记得检查文件是否保存成功了，另外核实两个ID是否一致
			//然后检查成功之后，跳转回UPDATE页面，删掉刚才那条日记的广播
			//仅自己可见的日记应该不出现在广播的啊。。操	
	},
	router = function (){
		//http://www.douban.com/note/create?voice=true
		if(ifupdate_url&&urlParams['voice']==='true'){
			initNote();
		}
		//如果是在刚创建的日记里则赶紧处理	
		var temp_note_id=localStorage["temp_note_id"];
		var new_note_url="http://www.douban.com/note/"+temp_note_id+"/";
		if(location.href===new_note_url){
			location.href="http://www.douban.com/update/";
		}

	}

	router();
 
} )();