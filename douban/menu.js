	var init_Menu=function(){
		//加入过滤器标示并建立好对象	
		var doumail=$("a[href*='http://www.douban.com/doumail/']");
			doumail.after("<a id='douban-filter-btn' href='#'>过滤名单</a>");
		var overlay_html="<div id='lemon-overlay' style='position:absolute;left: 0px;top: 0px;width:100%;height:100%;z-index: 1000;'>";
		var overlaydiv_html="<div id='lemon-overlaydiv' style='width:250px;height:400px;margin: 30px 0px 0px 70%;background-color: #fff;border:1px solid #000;padding:15px;overflow-y:scroll;'>";
		var closelnk_html="<a href='#'' class='overlay-lnk-close'>关闭[X]</a>";
		var clearlnk_html="<a href='#'' class='clear-all-banlist'>清空全部</a>";
		var content_html="<div id='ban-content'></div>";
		var overlayend_html="</div></div>";
		doumail.after(overlay_html+overlaydiv_html+closelnk_html+clearlnk_html+content_html+overlayend_html);
		//缓存好【过滤器】这个关键的按钮对象
		var db_filter_btn=$("#douban-filter-btn");
		//缓存好【弹出窗口的CLOSE对象】
		var overlay_close_btn=$(".overlay-lnk-close");
		//缓存设置窗口的遮罩层
		var overlay_background=$("#lemon-overlay");
		//缓存设置窗口本身
		var overlay_win=$("#lemon-overlaydiv");
		//缓存bancontent-div
		var ban_list_content=$("#ban-content");
		//当设置菜单隐藏后，取得指定的ID并隐藏
		//TODO：将设置的ID保存在LOCALSTORAGE里面去		
		jQuery.fn.hideandban = function() {
	    	var o = $(this[0]); 
	    	o.hide();    	
		};
		//设置窗口的关闭按钮行为
		overlay_close_btn.click(function(event){
			event.stopPropagation();
			overlay_background.hideandban();	
		});
		//如果在设置框外点击，则立即隐藏整个遮罩层
		overlay_background.click(function(){
			overlay_background.hideandban();	
		});
		//点击设置窗口本身就别冒泡了，好不？
		overlay_win.click(function(event){
			event.stopPropagation();
			overlay_background.show();	
		});
		//过滤器链接的点击事件响应
		db_filter_btn.click(function(){
				//console.log("db_filter_btn click!");
				overlay_background.show();
			}
		);
	};