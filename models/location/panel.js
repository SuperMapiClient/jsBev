/*geolocate*/
var geolocateHtml;
var markerLayer;
function js_bev_geoLocation(){
  geolocateHtml=$("#bev_geolocate_holder").html();
  var text="<div id='geolocate_title' style='font-size: 20px;margin-left: 5px;margin-bottom: 10px;margin-top: 10px;'>地理定位功能</div>";
	  text+="<div class='bev_geolocate_cont' style='margin-left: 5px;'>";
	  text+="<span>经度：<input id='lon' type='text' style='width:130px'/></span><br/>";
	  text+="<span>纬度：<input id='lat' type='text'style='width:130px'/></span>";
	  text+="</div><div style='margin-top: 15px;'>";
	  text+="<input type='button' id='centerLocate' title='地图中心点坐标' value='中心点坐标'>";
	  text+="<input type='button' id='clear' title='清空坐标' value='清空'>";
	  text+="<input type='button' id='myLocate' title='地理定位' value='地理定位'>";
	  text+="<input type='button' id='gotoLocate' title='转到设定坐标' value='转到'>";
	  text+="<input type='button' id='gotoLocate' title='返回主界面' value='返回' onclick='js_bev_geoLocation_back()'>";
	  text+="</div>";
  $("#bev_geolocate_holder").html(text).fadeIn(1000);
  geolocate_event();
}

function js_bev_geoLocation_back(){
	if(markerLayer){
		markerLayer.clearMarkers();
	}
	$("#bev_geolocate_holder").html(geolocateHtml);
}

//对地理定位功能监听事件封装
function geolocate_event(){
	$("#clear").click(function(){
		$("#lon").val("");
		$("#lat").val("");
	});
	$("#centerLocate").click(function(){
		var lon=map.getCenter().lon;
		var lat=map.getCenter().lat;
		
		var size = new SuperMap.Size(44, 33);
		var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
		var icon = new SuperMap.Icon("../../images/frameimages/marker.png", size, offset);
		if(markerLayer==null){
			markerLayer = new SuperMap.Layer.Markers("Markers");
			map.addLayer(markerLayer);
			markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(lon, lat), icon)); 
		}
		markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(lon, lat), icon)); 
		$("#lat").val(lat); 
		$("#lon").val(lon);
	});
	
	$("#gotoLocate").click(function(){
		if($("#lat").val()!=""&&$("#lon").val()!=""){
			map.setCenter(new SuperMap.LonLat($("#lon").val(),$("#lat").val()));
		}
	});
	
	$("#myLocate").click(function(){
		if (window.navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(successCallback,errorCallback, options);
		} else {
		  alert('您的浏览器不允许分享地理位置');
		}
	});
}

function successCallback(position) {
  $("#lat").val(""+position.coords.latitude+"°"); 
  $("#lon").val(""+position.coords.longitude+"°");
}

function errorCallback(error) {
   switch (error.code) {
     case error.PERMISSION_DENIED:
       alert('您拒绝了分享地理位置操作');
       break;
     case error.POSITION_UNAVAILABLE:
       alert('或取地理位置的过程出现错误');
       break;
     case error.TIMEOUT:
       alert('请求超时');
         break;
   }
}