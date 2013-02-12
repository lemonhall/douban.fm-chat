	var on_ban_people_btn_click=function(event,myself){
		//这里的代码逻辑没有任何问题，只在有HD的情况下出现
		//功能按钮，并抽取用户信息，问题出在过滤那部分
		var hd=myself.parent().parent().parent().parent();
		//console.log("谁发起的该点击？"+hd.html());
		var message_url=hd.find("div.bd a:eq(1)").attr("href");
		var user_url=hd.find("div.hd>a").attr("href");
		var user_uid=user_url.slice(29,-1);
		var user_name=hd.find("div.hd>a").attr("title");
		var user_icon=hd.find("div.hd>a>img").attr("src");
		var data_type=hd.attr("data-object-kind");
		// console.log(message_url);
		// console.log(data_type);
		// console.log(user_url);
		// console.log(user_uid);
		// console.log(user_name);
		// console.log(user_icon);
		var user=new Object();
			user.url=user_url;
			user.uid=user_uid;
			user.name=user_name;
			user.icon=user_icon;
			user.data_type=data_type;

		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		banlist.push(user);
		console.log("暂时关小黑屋功能处理过的BANLIST："+banlist);
		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		window.location.reload();
	},
	on_ban_temply_btn_click=function(event,myself){
			var myfather=myself.parent().parent().parent().parent();
			//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
			var data_object=myfather.find("div.bd p.text a:eq(1)").attr("href");
			if(debug==1){console.log("行为对象:"+data_object);}
			//【存入数据库】行为对象的描述
			var data_description=myfather.find("div.bd p.text a:eq(1)").html();
			if(debug==1){console.log("行为对象:"+data_description);}
			//调试信息

			var objban_url=new Object();
				objban_url.url=data_object;
				objban_url.data_description=data_description;

			var retrievedObject = localStorage.getItem('douban_banlist');
			var banlist=JSON.parse(retrievedObject);
				banlist.push(objban_url);
			if(debug==1){console.log("暂时关小黑屋功能处理过的BANLIST："+banlist);}
			localStorage.setItem('douban_banlist', JSON.stringify(banlist));
			window.location.reload();
	},
	init_reshare_btn=function(){
		//var retrievedObject = localStorage.getItem('douban_banmessage_options');
		//var ban_options=JSON.parse(retrievedObject);
		var reshare_btn=$("div.actions a.btn-reshare");
		reshare_btn.each(function(){
			var hd=$(this).parent().parent().parent().parent();
			var user_url=hd.find("div.hd>a").attr("href");
			if(user_url==undefined){

			}else{
				$(this).after("&nbsp;&nbsp;<a class='ban_temply_btn'>不再关注该话题</a>");
				$(this).after("&nbsp;&nbsp;<a class='ban_people_btn'>暂时关到小黑屋</a>");
			}
		});

		//在Action条下运行的，暂时关小黑屋功能
		var ban_temply_btn=$("a.ban_temply_btn");
		ban_temply_btn.click(function(event){
			on_ban_temply_btn_click(event,$(this));			
		});//End of 暂时关小黑屋功能LocalStorage

		//在Action条下运行的，暂时关小黑屋功能
		var ban_people_btn=$("a.ban_people_btn");
		ban_people_btn.click(function(event){
			on_ban_people_btn_click(event,$(this));		
		});//End of 暂时关小黑屋功能LocalStorage

	},
	ban_people=function(ban_list_content,user){
		//console.log('banstats-name: ', name);
		//精确定位到用户的超链接而非头像处
		var people=$("div.status-item p.text a[href*='"+user.url+"']");
		//console.log(people.parent().parent().parent().html());
		//people.parent().parent().parent().parent(['data-object-kind=1022']).hide();
		//console.log(people.parent().parent().parent().parent());
		people.parent().parent().parent().parent("[data-object-kind='"+user.data_type+"']").hide();

		//Add hyplink to 过滤器名单
			var name_img="<p><img src='"+user.icon+"'>";
			var name_link="<a href='"+user.url+"'>"+user.name+"</a>";
			var action=datatypehash[user.data_type]==undefined?user.data_type:datatypehash[user.data_type];
			//console.log(action);
			var data_type="&nbsp;只屏蔽了该用户的<span>"+action+"</span>"
			var clear_oneperson_ban="<a class='clear_oneperson_ban'>X</a></p>";
			ban_list_content.prepend(name_img+name_link+data_type+clear_oneperson_ban); 
	},
	do_clear_oneperson_ban=function(myself,event){	
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);	
		
		var ifexist=false;
		var banindex=0;
		var get_name=myself.parent().find('a').html();
		if(debug==4){
			console.log(get_name);
		}
		//取出保存在游览器内的名单,并判断是否存在
				jQuery.each(banlist,function(index, banobj){
					if(get_name===banobj.name){
						ifexist=true;
						banindex=index;//记录INDEX值
					};
				});
		if(debug==4){
			console.log("判断是否存在的bool:"+ifexist);
			console.log("PEOPLE:"+get_name);
		}
			if(ifexist==true){
				banlist.splice(banindex, 1);
			}
		if(debug==4){
			console.log(banlist);
		}
		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		myself.parent().html("");
  		window.location.reload();
	},
	do_clear_onetopic_ban=function(myself){
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		var ifexist=false;
		var banindex=0;
		var get_url=myself.parent().find('a').attr("href");
		if(debug==4){
			console.log(get_url);
		}
		//取出保存在游览器内的名单,并判断是否存在
				jQuery.each(banlist,function(index, objban_url){
					if(get_url==objban_url.url){
						ifexist=true;
						banindex=index;//记录INDEX值
					};
				});
		if(debug==4){
			console.log("判断是否存在的bool:"+ifexist);
			console.log("URL:"+get_url);
		}
			if(ifexist==true){
				banlist.splice(banindex, 1);
			}
		if(debug==4){console.log(banlist);}
		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		myself.parent().html("");
  		window.location.reload();

	},
	ban_message=function(ban_list_content,objban_url){
		//定位到需要屏蔽的推荐地址的URL对象上去
		var ban_url=$("div.status-item div.bd p.text a[href*='"+objban_url.url+"']");
		//console.log(people.parent().parent().parent().html());
		//people.parent().parent().parent().parent(['data-object-kind=1022']).hide();
		ban_url.parent().parent().parent().parent().hide();

		//Add hyplink to 过滤器名单
			var ban_link="<a href='"+objban_url.url+"'>"+objban_url.data_description+"</a>";
			var data_type="<p>&nbsp;>不再关注<span>"+ban_link+"&nbsp;</span>"
			var clear_onetopic_ban="<a class='clear_onetopic_ban'>X</a></p>";
			ban_list_content.prepend(data_type+clear_onetopic_ban);
	},
	ban_dongxi=function(){
			var subjs=$("a[href*='http://www.douban.com/subject/']");
			subjs.parent().parent().parent().hide();
	},
	init_filter=function(){
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		var ban_list_content=$("#ban-content");
		//ban_dongxi();
		//实际的隐藏工作的核心代码
		jQuery.each(banlist,function(index, objban){
		   if(objban.uid!=undefined){
		   		ban_people(ban_list_content,objban);
		   }else{
		   		ban_message(ban_list_content,objban);
		   }
		});//End of 实际的过滤代码.....就这么一小段而已

		//缓存bancontent-div
		var clear_onetopic_ban=$(".clear_onetopic_ban");
		//删除某个话题的BAN行为
		clear_onetopic_ban.click(function(event){
			event.stopPropagation();
			do_clear_onetopic_ban($(this));
		});

		//缓存bancontent-div
		var clear_oneperson_ban=$(".clear_oneperson_ban");
		//删除某个用户的BAN行为
		clear_oneperson_ban.click(function(event){
			event.stopPropagation();
			do_clear_oneperson_ban($(this));
		});

		//缓存好【清空全部对象】
		var clear_all_banlist_btn=$(".clear-all-banlist");
		//设置【清空全部对象】行为
		clear_all_banlist_btn.click(function(event){
			event.stopPropagation();
			var empty_array=new Array();
	  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
	  		ban_list_content.html("");
	  		window.location.reload();
		});		
	};