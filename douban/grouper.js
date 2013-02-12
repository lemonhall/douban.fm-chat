	var status_counter=function(statu_key,myself){
		var status=[];
		var data_object=statu_key.data_object;
		var uid_url=statu_key.uid_url;
		var data_description=myself.find("div.bd p.text a:eq(1)").html();
		var newitem=statu_key;
		//=============================================================
		//判断是否有KEY存在？如果存在，则取出，加入最新的data，然后保存
		if(localStorage.hasOwnProperty(data_object)){
			//循环外取出对象，到内存(这里应该还有优化的余地)
			var retrievedObject = localStorage.getItem(data_object);
			status=JSON.parse(retrievedObject);
			var ifexist=false;
			//这里应该剔除同一用户的同一全局行为
			jQuery.each(status,function(index, onestatu){	
				if(onestatu.uid_url==uid_url){
					ifexist=true;
				}
			});//Endof 剔除同一全局STATUS_URL的循环
			if((!ifexist)&&(newitem.user_name!=undefined)){
				status.push(newitem);
				status.sort(function(a,b) {return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);} );
				//可以在这里加入时间限制，比如超过3天的东西，就不予继续缓存在本地
				localStorage.setItem(data_object, JSON.stringify(status));
			}
			//here we filter some undefined url issues...
			}else if((data_object!=undefined)){
				var newarray=new Array();
				//第一次扫描得到该条目时，ARRAY的第一条为该条目的详细信息
				var dataitem={};
					dataitem.data_description=data_description;
						dataitem.data_timestamp=Date.now();
						newarray.push(newitem);
				localStorage.setItem(data_object, JSON.stringify(newarray));
				//加入TIME——INDEXER以及对dat_description的搜索支持
				buildTimeIndexer(data_object,dataitem);
			}//判断key/value存储当中dataobject_url是否计入存储的endif
			return status;
	},
	buildTimeIndexer=function(data_object,dataitem){
			var data_object=data_object||"";
			var dataitem=dataitem;
				dataitem.data_object=data_object;
			var statusIndexer=[];
			if(dataitem.data_description!="照片"){
				var retrievedObject = localStorage.getItem("statusTimeIndexer");
				if(retrievedObject===null){
					localStorage.setItem("statusTimeIndexer","[]");
					retrievedObject = localStorage.getItem("statusTimeIndexer");
				}
				statusIndexer=JSON.parse(retrievedObject);
				statusIndexer.push(dataitem);
				
				statusIndexer.sort(function(a,b) {return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);} );
				//console.log(statusIndexer);
				localStorage.setItem("statusTimeIndexer", JSON.stringify(statusIndexer));
			}
	},
	expand_topic=function(myself,data_sid){
		var status=JSON.parse(myself.attr("data-status"));
		var u_a_o=myself.parent();
		var user_quote_obj=u_a_o.find("div.bd blockquote");
			user_quote_obj.before("楼主说：");
		jQuery.each(status,function(index, onestatu){
		//不去管本条目本身
		if(onestatu.data_sid!=data_sid){	
			if(onestatu.user_quote!=null){
			//加入用户的发言信息
			var before_quote="<a href='"+onestatu.uid_url+"'>"+onestatu.user_name+"</a>&nbsp;"+onestatu.time+"&nbsp;说:"+"<blockquote><p>"+onestatu.user_quote+"</p></blockquote>";
			}else{
			var before_quote="<a href='"+onestatu.uid_url+"'>"+onestatu.user_name+"</a>&nbsp;"+onestatu.time+"<blockquote><p>什么也没说~</p></blockquote>";
			}
			//因为这里是异步的AJAX调用，所以不可能有任何的返回值，只是空而已
			var comments="";
			function getLatestComments() {
				return $.getJSON("http://www.douban.com/j/status/comments?sid="+onestatu.data_sid,
				function (data) {
				    //console.log(data.comments);
				    comments=data.comments;
				    	var o=$(comments);
				    	//split comments into a array of <p> element
				    	o.find("em").wrap("<blockquote/>");
				    	//bulect join these elements into a single jq object then append it
				    	var span=$("<span></span>").append(o);
				    	//console.log(span);
				    	u_a_o.before(before_quote+span.html());
				    //user_actions_obj.before($(comments).find("p").wrap("<blockquote/>"));
				});//End of Get json
			}
			function successFunc(){
				//console.log("success!");   
			    }			 
			function failureFunc(){
			    //console.log("failure!");
			    u_a_o.before(before_quote);
			}
			$.when(
			    getLatestComments()
			).then( successFunc, failureFunc );
		}//End of 过滤META信息的if
		});//End of Each
		//一旦展开完毕，就隐藏按钮，简化逻辑 
		$(this).hide();

	},
	folder_status=function(myself,status){
	//==============================================================================
	//定位p.text a对象，然后开始修改吧，少年
		var user_actions_obj=myself.find("div.actions");
		var counter=status.length;
		var color="#E9F4E9";
		if(counter>5) {
			color="#f4f4e9";
		};
		if(counter>10) {
			color="#e7e7cf";
		};
		if(counter>15){
			color="#dadab5";
		}
		if (counter>20) {
			color="#e9f4e9";
		};
		if(counter>25){
			color="#cfe7cf";
		}
		if(counter>30){
			color="#b5dab5";
		}
		if(counter>35){
			color="#9bcd9b";
		}
		if(counter>40){
			color="#80c080";
		}
		// if(counter>20){
		// 	color="#fff0de";
		// }
		// if(counter>23){
		// 	color="#ffe4c4";
		// }
		// if(counter>26){
		// 	color="#66b366";
		// }
		// if(counter>29){
		// 	color="#b5b5da";
		// }				
		// if(counter>32){
		// 	color="#9b9bcd";
		// }if(counter>35){
		// 	color="#8080c0";
		// }if(counter>38){
		// 	color="#dab5da";
		// }if(counter>41){
		// 	color="#cd9bcd";
		// }
		user_actions_obj.parent().parent().parent().css("background-color",color);
			//加入按钮并绑定数据
			user_actions_obj.find(".ban_temply_btn").after("&nbsp;&nbsp;<a class='folder_topic'>展开该话题?"+"/共有"+(status.length-1).toString()+"人关注</a>");
		var folder=user_actions_obj.find(".folder_topic");
		//将数据包序列化后存储在相应的DOM元素上，这简直就是OO啊
		var datas=JSON.stringify(status);
			folder.attr("data-status",datas);
		//【数据库KEY】SID
		var data_sid=myself.attr("data-sid");
			if(debug==1){console.log("ID:"+data_sid);}
				//绑定好对应的处理函数
				folder.bind('click', function(){
					expand_topic($(this),data_sid);
				});
	},
	status_saner=function(myself){
		//优先判断是否为值得存取的类型
		//【存入数据库】类型
		var data_kind=myself.attr("data-object-kind");
		//【存入数据库】数据行为
		var data_action=myself.attr("data-action");
		//打印人性化的提示信息
		var action=datatypehash[data_kind]===undefined?data_kind:datatypehash[data_kind];
			if(debug==1){console.log("Kind:"+action);}		
		//【数据库KEY】SID
		var data_sid=myself.attr("data-sid");
			if(debug==1){console.log("ID:"+data_sid);}
		//用户地址
		var user_url=myself.find("div.bd p.text a:first").attr("href");
			if(debug==1){console.log("user_url:"+user_url);}		
		//用户的昵称
		var user_name=myself.find("div.bd p.text a:first").html();
			if(debug==1){console.log("user_name:"+user_name);}
		//用户的发言
		var user_quote=myself.find("div.bd blockquote p").html();
			if(debug==1){console.log("user_quote:"+user_quote);}
		//【存入数据库】用户的唯一ID
		var user_uid=user_url.slice(29,-1);
			if(debug==1){console.log("user_uid:"+user_uid);}
		//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
		var data_object=myself.find("div.bd p.text a:eq(1)").attr("href");
			if(debug==1){console.log("行为对象:"+data_object);}
		//【存入数据库】行为对象的描述
		var data_description=myself.find("div.bd p.text a:eq(1)").html();
			if(debug==1){console.log("行为对象:"+data_description);}
		//【存入数据库？】时间对象？
		var time=myself.find("div.actions span.created_at").attr("title");
			if(debug==1){console.log("Time:"+time);}
		//生成一个全局对象ID的URL并存入数据库
		var uid_url=user_url+"status/"+data_sid;
		//建立新的ITME对象，暂时只记录这一条的UID以及时间还有
		var newitem={};
			newitem.user_uid=user_uid;
			newitem.time=time;
			newitem.user_name=user_name;	
			newitem.uid_url=uid_url;
			newitem.data_sid=data_sid;
			newitem.user_quote=user_quote;
			newitem.data_object=data_object;
		return newitem;
	},
	init_grouper=function(){
		var need_save_kind={1026:"相册推荐",1013:"推荐小组话题",1015:"推荐/新日记",1012:"推荐书评",3065:"东西",1025:"推荐相片"}
		$("div.status-item").each(function(){
			var myself=$(this);
			//优先判断是否为值得存取的类型
			//【存入数据库】类型
			var data_kind=myself.attr("data-object-kind");
			//【存入数据库】数据行为
			var data_action=myself.attr("data-action");
				if(debug==1){console.log("Action:"+data_action);}
		//============================================
		if((need_save_kind.hasOwnProperty(data_kind))&&(data_action=="0"||data_action=="1")){
			var statu_item=status_saner(myself);
			var status=status_counter(statu_item,myself);
				//如果大于2则打上颜色标记，并加入展开逻辑的代码，在按钮上附加上数据
				if(status.length>2){
					folder_status(myself,status);
				}
			}//End of grouper
		});//End of Each statu
	};//End of init_grouper