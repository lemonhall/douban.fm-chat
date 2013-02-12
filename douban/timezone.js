			var get_human_offset=function(date_time){
				//入口参数为帖子的时间与当前时间的分钟差值
				var human_offset="";
				var d = new Date(date_time);
				var now=new Date();				
				var offset = -1*(now.getTimezoneOffset()/60);
				var localtime = d.getTime();
				//这里的豆瓣时间的offset是一个固定值，-480不用再取
				var localoffset = -480 * 60000;
				var utc = localtime + localoffset;
				var bombay = utc + (3600000*offset);
				var time_offset=(now-bombay)/60000;
				var bombayDate=new Date(bombay);
				var day_offset=now.getDate()-bombayDate.getDate();
				var year_offset=now.getFullYear()-bombayDate.getFullYear();
				var month_offset=now.getMonth()-bombayDate.getMonth();
					day_offset=day_offset+year_offset*365+month_offset*30;
					
				var bombay_hours=bombayDate.getHours();
				if(day_offset<1){
						if(time_offset<5){
							human_offset="刚刚";
						}
						if(time_offset>5){
							human_offset=parseInt(time_offset).toString()+"分钟前";
						}
						if(time_offset>30){
							human_offset="半时前";
						}				
						if(time_offset>60){
							human_offset="1小时前";
						}
						if(time_offset>120){
							human_offset="2小时前";
						}
						if(time_offset>180){
							human_offset="3小时前";
						}
						if(time_offset>240){
							if(bombay_hours>=0){
								human_offset="今日凌晨";
							}
							if(bombay_hours>=5){
								human_offset="今日清晨";
							}												
							if(bombay_hours>=8){
								human_offset="今日上午";
							}
							if(bombay_hours>=12){
								human_offset="今日中午";
							}	
							if(bombay_hours>=14){
								human_offset="今日下午";
							}
							if(bombay_hours>=18){
								human_offset="今日晚上";
							}
							if(bombay_hours>=22){
								human_offset="今日深夜";
							}
						}
				}
				if(day_offset===1){
						if(bombay_hours>=0){
							human_offset="昨天凌晨";
						}
						if(bombay_hours>=5){
							human_offset="昨天清晨";
						}												
						if(bombay_hours>=8){
							human_offset="昨天上午";
						}
						if(bombay_hours>=12){
							human_offset="昨天中午";
						}	
						if(bombay_hours>=14){
							human_offset="昨天下午";
						}
						if(bombay_hours>=18){
							human_offset="昨天晚上";
						}
						if(bombay_hours>=22){
							human_offset="昨日深夜";
						}
				}
				if(day_offset>1){
						var nd = new Date(bombay);
						var newString=nd.toLocaleDateString()+" "+nd.toLocaleTimeString();
						human_offset=newString;
				}
				return human_offset;

			},
			get_time=function(date_time){
				//豆瓣的默认时区是东八区，那么  2012-8-25 10:36的文章
				//如果我在东七区，那么应该显示，2012-8-25 9:36才是正确的
				//1、得到所谓的豆瓣时间。2、将豆瓣时间换算成UTC时间
				//3、
				var d = new Date(date_time);
				var now=new Date();				
				var offset = -1*(now.getTimezoneOffset()/60);
				var localtime = d.getTime();
				//这里的豆瓣时间的offset是一个固定值，-480不用再取
				var localoffset = -480 * 60000;
				var utc = localtime + localoffset;
				var bombay = utc + (3600000*offset);
				var nd = new Date(bombay);
				var newString=nd.toLocaleDateString()+" "+nd.toLocaleTimeString();
				return newString;

			},
			init_onestatus_timezone=function(){
				
				$(".created_at").each(function(){
					var date_time=$(this).html();
					var new_date_time=get_time(date_time);
					$(this).html(new_date_time);
				});

			},
			init_timezone=function(){
				$(".created_at").each(function(){
					var date_time=$(this).attr("title");
					var obj_human_date_time=$(this).find("a");
					$(this).attr("title",get_time(date_time));
					obj_human_date_time.html(get_human_offset(date_time));

				});
			};