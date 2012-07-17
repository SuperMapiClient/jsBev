
/***打印地图***/
function printMap(){  
    window.print();
}


/***分享地图***/

function shareMap(){
  $("#sharepanel").css("display","block");   
}
// 关闭地图共享面板
function closeShareMapDiv() {
  $("#sharepanel").hide();
}



/***地图全屏***/

function screem(){
	var _leftdiv =document.getElementById('leftbar');
	var _arrow =document.getElementById('SlideTab');
	var _header =document.getElementById('header');
	var _word =document.getElementById('entireScreen');
	var _right_map =document.getElementById('mainMap');
	var _map = document.getElementById("map");
	var bodyHeight = pageHeight();
	//全屏
	if(typeof(_word.alt)=="undefined" || _word.alt == "entire"){	
		_leftdiv.style.display="none";
		_arrow.style.display="none";
		_header.style.display="none";
		_word.alt = "close";
		_word.title ="退出全屏"
		_right_map.style.width="100%";
		_right_map.style.height="100%";
		_map.style.height=bodyHeight-30+"px";
		var html="<img src='./images/frameimages/tuichuquanp.png'></img>退出全屏"
		$("#a_fullscreen").html(html);
	}
	//退出全屏
	else{	
		_leftdiv.style.display="";
		_arrow.style.display="";
		_header.style.display="";
		_word.alt = "entire";
		_word.title = "全屏";
		_right_map.style.width="79.9%";
		_right_map.style.height="";
		_map.style.height="705px";
		var html="<img src='./images/frameimages/fullScreen.png'></img>全屏"
		$("#a_fullscreen").html(html);
	}
}


