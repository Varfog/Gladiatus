function wait(){
	if(document.head){
		var e = document.createElement('script');
		e.type = 'text/javascript';
		e.setAttribute('defer','');
		e.src = chrome.extension.getURL('base.js');
		var h = document.getElementsByTagName('head')[0];
		h.insertBefore(e, h.firstChild);
		var UICSS = document.createElement('link');UICSS.rel="stylesheet";UICSS.type="text/css";UICSS.media="screen";UICSS.href=chrome.extension.getURL("css/UI.css");
		h.insertBefore(UICSS, h.firstChild);
	}else{
		setTimeout(wait, 250);
	}
}
wait();