chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
  	if (details.url === 'http://www.douban.com/'){
    	return {redirectUrl: 'http://www.douban.com/update/'};
    }
  },
  {urls: ["http://www.douban.com/*"]},
  ["blocking"]);
console.log('Hello ???');