var loader = {
	show: function(_text){
		$.mobile.loading( 'show', {	text: _text,	textVisible: true,	theme: 'a',	html: ""});
	},
	hide: function(){
		$.mobile.loading( 'hide', {	text: "",	textVisible: true,	theme: 'a',	html: ""});
	}
};
var info_box = {
    show: function(_text){
        $.mobile.loading( 'show', {	text: '',	textVisible: true,	theme: 'a',	html: '<center>'+_text+'</center>'});
        window.setTimeout(loader.hide,3000);
    }
}
var info_box_ok = {
    show: function(_text,_btn_text,_callBack){
        var btn = document.createElement('button');
        var t=document.createTextNode(_btn_text);
        btn.appendChild(t);
        btn.onclick = _callBack;
        btn.setAttribute('style','width:50%');

       
        $.mobile.loading( 'show', {	text: '',	textVisible: true,	theme: 'a',	html: '<center>'+_text+'<br><br><span id=info_btn_place></span></center>'});
        document.getElementById("info_btn_place").appendChild(btn);
        window.setTimeout(loader.hide,3000);
    }
}


