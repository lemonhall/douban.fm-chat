
//它相当于是ROUTER，接受信息，并将任务分配到各个处理机制上去
//content.js所需要的文件
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log( "request:==========================" );

    console.log( request );
    if (request.method == "getFile"){
    	sendFileResponse(request)
    		.then(function(response){
    			sendResponse(response);
    	},function(e){
    			sendResponse(e);
    	});
    }
    if (request.method == "setFile"){
    	sendSetFileMsg(request)
    		.then(function(response){
    			sendResponse(response);
    	},function(e){
    			sendResponse(e);
    	});      
    }
    //将加好友的实际请求发送给node.js的server，然后由server控制
    //phantomjs来加某个人
    if (request.method == "setFriendShip"){
    	//console.log(request);
    	if(request.id!=undefined){
			socket.emit('setFriendShip', {user_id:request.id});
		}     
    }
    //将加好友的实际请求发送给node.js的server，然后由server控制
    //phantomjs来加某个人
    if (request.method == "unsetFriendShip"){
    	//console.log(request);
    	if(request.id!=undefined){
			socket.emit('unsetFriendShip', {user_id:request.id});
		}     
    }       
    if (request.method == "heartBeat"){
    	sendResponse(1);
	}

	return true;     		
});
})();