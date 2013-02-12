	redirecttoSearchView=function(){
		setTimeout(function(){
			location.href="http://www.douban.com/people/lemonhall2012/things?renderSearchView=true";
		},300);
	},
	initSearchView = function (){
			var doumail=$("a[href*='http://www.douban.com/doumail/']");

			doumail.after("<a id='douban-mysearch'>搜索</a>");


			var douban_mysearch_btn=$("#douban-mysearch");
			douban_mysearch_btn.bind("click",function(event){
				redirecttoSearchView();
			});			
	}