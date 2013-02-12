	var ifpeople_url=location.href.slice(0,29)=="http://www.douban.com/people/";
	var url_array=location.href.split("/");
	var ifpeople_statuses=false;
	var ifone_status=false;	
	if(url_array[url_array.length-3]==="status"){
		ifone_status=true;
	}else{
		ifone_status=false;
	}
	if(/statuses/.test(url_array[url_array.length-1])){
		ifpeople_statuses=true;
	}else{
		ifpeople_statuses=false;
	}
	var getUserName=function(){
		var name=$(".info h1").html();
		var temp=name.split('\n');
		return  $.trim(temp[1]);
	},
	getUserFollowing=function(options){
		var deferred = $.Deferred(); 
		var promise = deferred.promise();
        var xhr = new XMLHttpRequest(),
            method = options.method || 'get';
        xhr.responseType = options.responseType ||'text';   

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
	}
	init_seeAlso=function(){
		var div="<div id='common' class='obssin clearfix'>";

		var title="<h2>我和"+getUserName()+"共同关注的友邻(42)"+
            		"&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·"+
    				"</h2>";
    	var prev="<span class='prev'>"+
            "<a id='b_p' class='dis' href='javascript:void(0)' title='后退' hidefocus='true'>&lt;</a>"+
            "</span>";
        var next="<span class='next'>"+
            "<a id='b_n' class='' href='javascript:void(0)' title='前进' hidefocus='true'>&gt;</a>"+
            "</span>";
        var end_div="</div>";
        var li="<li class='aob'>fasdfasdf</li>";
        var lis="";
        for(var i=0;i<50;i++){
        	lis=lis+li;
        }
        var content_div="<div><ul id='win'>"+
        					lis+
        			    "</ul></div>";
    	var view=div+title+prev+content_div+next+end_div;
		
		$(".obssin:first").after(view);

		getUserFollowing({uri:"http://www.douban.com/people/tulala810/contacts",method:"get"}).then(function(res){
				
				var obss=$(res.responseText).find(".obss dt a");
				obss.each(function(index, Element){
			
				});
		});

	},
	add_contract_pluse=function(people_id,ck){
		var xhr = new XMLHttpRequest();

	    var deferred = $.Deferred(); 
		var promise = deferred.promise();

	    var fd = new FormData();
	    	//people_id
	    	fd.append('user_id', people_id);
		    //先传递钥匙过去
		    fd.append('ck', ck);

	    xhr.open('POST', 'http://api.douban.com/shuo/friendships/create', true);

	    xhr.onerror = function(e) {
			deferred.reject(xhr, e);
        }

	    xhr.onload = function(e) {
	        if (xhr.status == 200) {
	            deferred.resolve(xhr);
	        }
	    };

	    // Transmit the form to the server
	    xhr.send(fd);


	    return promise;
	},
	init_add_contract=function(){
		// POST /j/contact/addcontact HTTP/1.1
		// Host: www.douban.com
		// Content-Length: 23
		// Accept: application/json, text/javascript, */*; q=0.01
		// Origin: http://www.douban.com
		// X-Requested-With: XMLHttpRequest
		// User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.19 (KHTML, like Gecko) Chrome/25.0.1323.1 Safari/537.19
		// Content-Type: application/x-www-form-urlencoded
		// Referer: http://www.douban.com/people/silconfuse/
		// Accept-Encoding: gzip,deflate,sdch
		// Accept-Language: zh-CN,zh;q=0.8
		// Accept-Charset: UTF-8,*;q=0.5
		// Cookie: bid="pZo2mDUH5fA"; ct=y; dbcl2="58233926:sQyZ4MQiEfA"; ck="-0zB"; __utma=30149280.488156673.1353810841.1355902450.1355916218.35; __utmb=30149280.28.10.1355916218; __utmc=30149280; __utmz=30149280.1354612691.18.3.utmcsr=book.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/annotation/22935588/; __utmv=30149280.5823

		// people=48156564&ck=-0zB

		//从页面上取到两个最重要的值，user_id以及ck的值，以备REQUEST使用
		var add_contract_btn=$(".user-opt a:first");
			var user_id=add_contract_btn.attr("id");
		var ck_input=$("input[name=ck]:first");
			var ck_value=ck_input.attr("value")
		//构造新的按钮
		var new_btn="<a href='javascript:void(0)' id='add_contract_pluse' class='a-btn'>加强版关注</>";	
			add_contract_btn.after(new_btn);
		var add_contract_pluse_btn=$("#add_contract_pluse");


		//按钮实际处理逻辑
		add_contract_pluse_btn.bind("click",function(){
			console.log("USER ID:"+user_id);
			console.log("CK_VALUE:"+ck_value);
			// add_contract_pluse(user_id,ck_value).then(function(xhr){
			// 	window.location.reload();
			// 	//console.log("faslkdjflajsldjfjalskjdfjlask");
			// 	//console.log(xhr);
			// });

				var msg={method:"setFriendShip",id:user_id};
				console.log(msg);
				chrome.extension.sendMessage(msg, function(response) {
			  		
				});
			
		});

		//console.log("user ID:"+add_contract_btn.attr("id"));

	};
	var router = function (){
		if(urlParams["renderTagView"]==="true"){
				renderTagView();
		}
		if(urlParams["renderSearchView"]==="true"){
				renderSearchView();
		}
		//某个人的页面，自己的也在内
		if(ifpeople_url&&ifpeople_statuses===false&&ifone_status===false){
			init_add_contract();
			//init_seeAlso();
		}//ifpeople_url end
		//我的广播	
		if(ifpeople_url&&ifpeople_statuses===true){
			init_timezone();
		}//ifpeople_url end
		//进入某一条广播之后	
		if(ifpeople_url&&ifone_status===true){
			init_onestatus_timezone();
		}//ifpeople_url end	
	}
	router();