	var ifgroup_url=location.href.slice(0,28)=="http://www.douban.com/group/";
	//console.log(location.href.slice(0,28));
	var do_hide_others_replay=function(){
		var topic_owner=$("div .topic-doc h3 span a:first")[0];
		var owner_href="";
		if (topic_owner) {
			var owner_href=topic_owner.href;
			localStorage["group_topic_ban"]=owner_href;
		}else{
			owner_href=localStorage["group_topic_ban"];
		}		
		var owners_topics=$(".reply-doc h4 a[href!='"+owner_href+"']");
		owners_topics.parent().parent().parent().parent().hide();

	},
	mark_floor=function(){

	},
	init_view=function(){
		var doumail=$("a[href*='http://www.douban.com/doumail/']");
		//自动翻页功能相关代码段===================
		var ifhide=localStorage["group_topic_ban_onoff"];
			if(ifhide==="true"){
				do_hide_others_replay();
				doumail.after("<a id='hide_others_replay'>全部可见</a>");
			}else{
				doumail.after("<a id='hide_others_replay'>只看楼主</a>");
			}

		$("#hide_others_replay").bind("click",function(){
			var ifhide=localStorage["group_topic_ban_onoff"];
			if(ifhide==="true"){			
				localStorage["group_topic_ban_onoff"]="false";
				$(this).html("只看楼主");
			}else{
				localStorage["group_topic_ban_onoff"]="true";
				$(this).html("全部可见");
			}
			window.location.reload();
		});	
	};
	var router = function (){
		if(ifgroup_url){
			init_view();
		}//ifpeople_url end	
	}
	router();