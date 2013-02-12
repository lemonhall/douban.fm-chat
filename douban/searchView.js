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
//读入索引
var statusIndexer=[];
var retrievedObject = localStorage.getItem("statusTimeIndexer");
if(retrievedObject===null){
	localStorage.setItem("statusTimeIndexer","[]");
	retrievedObject = localStorage.getItem("statusTimeIndexer");
}
statusIndexer=JSON.parse(retrievedObject);
//====================================================================
//kind:"网址",Date:"\["2012年6月","2012年7月"\]",Tags:"科技,时尚",
//User:"\[RDX,xuxin]\
var renderOption	=	{};

//这个函数也需要泛化
var	search_temple=function(){
		var Weigt 	 = "";
		var content	 = "<div class='hd'><h2>搜索。。。。。</h2></div>";
		var label 	 = "<label for='thing-side-search-inp' style='display: block;'>所有的东西</label>";
		var input    = "<input id='thing-side-search-inp' name='q' size='50' class='inp' value='' autocomplete='off' goog_input_chext='chext'>";
		var span_btn = "<span class='bn-flat'><input id='lemon_search' type='submit' value='搜索'></span>";
		var search_final = "<div>"+label+input+span_btn+"</div>";
		Weigt=content+search_final;
		$("#bysearch").html(Weigt);
		$("#lemon_search").click(function(){
			var srhTerm=$("#thing-side-search-inp").val();
				console.log(srhTerm);
			var result=doSearch(srhTerm);
				renderSearchResult(result);
		});	
	},
	doSearch=function(srhTerm){
		var result=[];
		var HTMLresult="";
		// statusIndexer
		// statusIndexer.data_description
		// statusIndexer.data_timestamp
		// statusIndexer.data_object
		jQuery.each(statusIndexer,function(index, onestatu){	
				var ifexist=onestatu.data_description.indexOf(srhTerm);
				if(ifexist>=0){
					result.push(onestatu);
				}		
		});
		if(result.length>0){
			jQuery.each(result,function(index, onestatu){
				var t="<a href='"+onestatu.data_object+"'>"+onestatu.data_description+"</a>";
				HTMLresult=HTMLresult+t+"</br></br>";
			});
		}
		
		return HTMLresult;
	},
	renderSearchResult=function(result){
		$(".article").html("");
			var templete = result;
		$(".article").html(templete);
	}
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
				search_temple();
				date_temple();
	},
	renderTitle=function(){
			var objtitle=$(".info:first h1:first");
			var title=objtitle.html();
			objtitle.html(title.replace("东西","广播搜索"));
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
	renderSearchView=function(){
		//<div id="db-usr-profile">
		//<div class="clear">
		//<div class="grid-16-8 clearfix">
		//<div class="article">
		//<div class='paginator'>
		//<div class="aside">
		//<div class="extra">
		renderTitle();
		render_asideWeigt();
		$(".article").html("");		

	};