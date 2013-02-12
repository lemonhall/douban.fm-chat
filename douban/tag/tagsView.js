	var urlParams = {};
	var debug=1;
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();


var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
//加载初期就读入硬盘上的两个索引，以便快速处理页面
//TODO:当没有任何数据的时候，JS会报错，记得处理这个问题
var INDEX_ARRAY 	= ["Kind","User"];
var IndexerHash		= {};
_.each(INDEX_ARRAY, function(INDEX){		
	var IndexName=INDEX+"Indxer";
	var CounterName=INDEX+"Counter";
	if(localStorage[IndexName]){
		IndexerHash[IndexName]=JSON.parse(localStorage[IndexName]);
	}else{
		IndexerHash[IndexName]= {};
	}
	if(localStorage[IndexName]){
		IndexerHash[CounterName]=JSON.parse(localStorage[CounterName]);
	}else{
		IndexerHash[CounterName]= {};
	}
});
//====================================================================
//kind:"网址",Date:"\["2012年6月","2012年7月"\]",Tags:"科技,时尚",
//User:"\[RDX,xuxin]\
var renderOption	=	{};

//这个函数也需要泛化
var	renderTagstemplete=function(){		
		var type	 = renderOption["Kind"]	|| "我说";
		var kind_ids = [];
		var KindIndxer = IndexerHash["KindIndxer"];
		if(KindIndxer[type]){
			kind_ids=JSON.parse(KindIndxer[type]);
		}
		var GetInterSection=function(gener){
			//gener==User,date,tags
			if(renderOption[gener]){
				//console.log(renderOption["User"]);==>RDX,12312,2312
				var users 	  = JSON.parse(renderOption[gener]) || [];
			if(debug==1){console.log("User from mem cache of option:"+users);}
				var user_ids  = [];
				var IndexName = gener+"Indxer";
				//Indexer == IndexerHash[UserIndxer] == UserIndexer
			if(debug==1){console.log("IndexName:"+IndexName);}
				var Indexer   = IndexerHash[IndexName];
			if(debug==1){console.log(Indexer);}
			_.each(users, function(user){
				if(debug==1){console.log("Get form array:"+user);}			
						var temp 	 = JSON.parse(Indexer[user]);
						user_ids	 = _.union(user_ids,temp);
					});
				kind_ids=_.intersection(kind_ids,user_ids);
			}
		}
			GetInterSection("User");
		//console.log("入口参数："+type);
		var items	 = [];
		var templete = "";		

		_.each(kind_ids, function(id){ 
			//console.log(id);
			var status= JSON.parse(localStorage[id]);
			var btn_delete = "&nbsp;&nbsp;<a class='btn_delete' data-tobedelete-id='"+id+"'>x</a>";
	        items.push(status.user_quote+btn_delete);
		});
	    templete=items.join("<br><br>");
	    return templete;
	},
	byuser_temple=function(){
		var Weigt="";
		var content	 = "<div class='hd'><h2>用户。。。。。</h2></div>";
		var byUser =[];
		var UserCounter=IndexerHash["UserCounter"];
		Object.keys(UserCounter)
				.forEach(function(key){
          			var counter= UserCounter[key];
		  			var temp="<a class='render-byuser' data-byuser='*User*'>*User*("+counter+")</a>";
		  			byUser.push(temp.replace("*User*",key).replace("*User*",key));

       			});
       	var byUser_string=byUser.join("&nbsp;&nbsp;");
		var byUser_string = "<div>"+byUser_string+"</div>";
		Weigt=content+byUser_string;
		$("#byuser").html(Weigt);
		//以后可以建立数组并动态绑定事件到对应的事件
			$(".render-byuser").bind("click",function(){
				var user=$(this).attr("data-byuser");

				var users_list=[];
					if(renderOption["User"]){
						users_list=JSON.parse(renderOption["User"]);
					}else{					
						users_list=[];
					}
		//TODO:给USER按钮加上开关特性，按下则压入渲染队列
		//再次按下则退出渲染队列
		//颜色嘛，暂定为豆瓣的绿色吧
				if($(this).attr("data-toggle")=="off"){
					$(this).attr("data-toggle","on");
					$(this).css("background-color","#E9F4E9");
					users_list.push(user);
				}else{
					$(this).attr("data-toggle","off");
					$(this).css("background-color","");
					users_list=_.without(users_list, user);
				}								
				renderOption["User"]=JSON.stringify(users_list);
				RenderArticleWeigt();
			});
	},
	byclass_temple=function(){
		var Weigt="";
		var content	 = "<div class='hd'><h2>分类。。。。。</h2></div>";
		var byclass =[];
		var KindCounter=IndexerHash["KindCounter"];
		Object.keys(KindCounter)
				.forEach(function(key){
          			var counter= KindCounter[key];
		  			var temp="<a class='render-byclass' data-byclass='*kind*'>*kind*("+counter+")</a>";
		  			byclass.push(temp.replace("*kind*",key).replace("*kind*",key));

       			});
		var byclass_string=byclass.join("&nbsp;&nbsp;");
		var byclass_final = "<div>"+byclass_string+"</div>";
		Weigt=content+byclass_final;
		$("#byclass").html(Weigt);
		//以后可以建立数组并动态绑定事件到对应的事件
			$(".render-byclass").bind("click",function(){
				var type=$(this).attr("data-byclass");
				renderOption["Kind"]=type;
				RenderArticleWeigt();
			});
	},
	search_temple=function(){
		var Weigt 	 = "";
		var content	 = "<div class='hd'><h2>搜索。。。。。</h2></div>";
		var label 	 = "<label for='thing-side-search-inp' style='display: block;'>所有的东西</label>";
		var input    = "<input id='thing-side-search-inp' name='q' size='50' class='inp' value='' autocomplete='off' goog_input_chext='chext'>";
		var span_btn = "<span class='bn-flat'><input id='lemon_search' type='submit' value='搜索'></span>";
		var search_final = "<div>"+label+input+span_btn+"</div>";
		Weigt=content+search_final;
		$("#bysearch").html(Weigt);		
	},
	date_temple=function(){
		var Weigt 	 = "";
		var content	 = "<div class='hd'><h2>日期。。。。。</h2></div>";
		var date_final = "<div><ul><li><a>一月份</a></ul></div>";
		Weigt=content+date_final;
		$("#bydate").html(Weigt);	
	},
	render_asideWeigt=function(){        
    		var aside    		= 	"<div class='aside'>";
    		var end_div  		= 	"</div>";
    		var byclass			=	"<div id='byclass'></div>";
    		var search			=	"<div id='bysearch'></div>";
    		var date 			=   "<div id='bydate'></div>";
    		var user 			=	"<div id='byuser'></div>";
			$(".aside").html("");			
			$(".aside").html(aside+byclass+"<br/>"+search+"<br/>"+date+"<br/>"+user+end_div);
				byclass_temple();
				search_temple();
				date_temple();
				byuser_temple();
	},
	renderTitle=function(){
			var objtitle=$(".info:first h1:first");
			var title=objtitle.html();
			objtitle.html(title.replace("东西","收藏"));
	},
	RenderArticleWeigt= function(){
		//console.log("入口参数："+type);
		$(".article").html("");
			var templete = renderTagstemplete();
		$(".article").html(templete);
		$(".btn_delete").bind("click",function(){
				var id=$(this).attr("data-tobedelete-id");
				alert("Are you sure to delete "+id+" ??");
		});
	},
	renderTagView=function(){
		//<div id="db-usr-profile">
		//<div class="clear">
		//<div class="grid-16-8 clearfix">
		//<div class="article">
		//<div class='paginator'>
		//<div class="aside">
		//<div class="extra">
		renderTitle();
		render_asideWeigt();
		RenderArticleWeigt();		

	};