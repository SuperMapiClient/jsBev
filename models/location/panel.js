﻿/*geolocate*/
var geolocateHtml;
var markerLayer;
function js_bev_geoLocation() {
    $("#panel_handle > h4").fadeOut(50);
    $("#panel_handle").css("background-image","url('./images/frameimages/location.png')");
    $("#back").fadeIn(50);
    //$("#back").click(function(){js_bev_geoLocation_back()});
    $("#back").attr("onClick","js_bev_geoLocation_back()");
    $("#jsBev_sample").hide();
    geolocateHtml = $("#jsBev_sample").html();
    var text = "<div class='bev_geolocate_cont' >";
    text += "<span class='fontstyle'>经度：<input class='input' id='lon' type='text'/></span><br/>";
    text += "<span class='fontstyle'>纬度：<input class='input' id='lat' type='text'/></span>";
	text += "<span class='fontstyle'>地址：<input class='input' id='address' type='text'/></span>";
    text += "</div><div>";
    text += "<p class='button3' id='myLocate' >当前位置</p>";
    text += "</div>";

    $("#jsBev_sample").animate({"opacity":"0"},50,function(){
        $("#panel_handle > h4").text("地理定位").fadeIn(50);
        $("#jsBev_sample").html(text).animate({"opacity":"1"},50);
        geolocate_event();
    });
        
}

function js_bev_geoLocation_back() {
    $("#panel_handle > h4").fadeOut(50);
    $("#panel_handle").css("background-image","url('./images/frameimages/chilun.png')");
    $("#back").fadeOut(50);
    $("#jsBev_sample").hide();
    
    if (markerLayer) {
        markerLayer.clearMarkers();
    }
    
    $("#jsBev_sample").animate({"opacity":"0"},50,function(){
        $("#panel_handle > h4").text("功能面板").fadeIn(50);
        $("#jsBev_sample").html(geolocateHtml).animate({"opacity":"1"},50);
    });
}

//对地理定位功能监听事件封装
function geolocate_event() {
    var geolocate = new SuperMap.Control.Geolocate({
    bind: false,
    geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    }
});

map.addControl(geolocate);
    $("#clear").click(function () {
        $("#lon").val("");
        $("#lat").val("");
    });
    $("#centerLocate").click(function () {
        var lon = map.getCenter().lon;
        var lat = map.getCenter().lat;

        var size = new SuperMap.Size(44, 33);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon = new SuperMap.Icon("./resource/controlImages/marker.png", size, offset);
        if (markerLayer == null) {
            markerLayer = new SuperMap.Layer.Markers("Markers");
            map.addLayer(markerLayer);
            markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(lon, lat), icon));
        }
        markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(lon, lat), icon));
        $("#lat").val(lat);
        $("#lon").val(lon);
    });

    $("#myLocate").click(function () {
        geolocate.watch = true;
        geolocate.activate();
    });
    
    geolocate.events.register("locationupdated",geolocate,function(e) {
        $("#lat").val("" + e.point.y + "°");
        $("#lon").val("" + e.point.x + "°");
        
		var lon = e.point.x;
		var lat = e.point.y;
		sosoExp(lon,lat);
		
		if (markerLayer) {
            markerLayer.clearMarkers();
        }
        if ($("#lat").val() != "" && $("#lon").val() != "") {
            var size = new SuperMap.Size(44, 33);
            var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
            var icon = new SuperMap.Icon("./resource/controlImages/marker.png", size, offset);
            if (markerLayer == null) {
                markerLayer = new SuperMap.Layer.Markers("Markers");
                map.addLayer(markerLayer);
                markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat($("#lon").val(), $("#lat").val()), icon));
            }
            markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat($("#lon").val(), $("#lat").val()), icon));
            map.setCenter(new SuperMap.LonLat($("#lon").val(), $("#lat").val()));
        }
		
        geolocate.watch = false;
        geolocate.deactivate();
    });
}
function sosoExp(lon,lat) { 
	   var geocoder = new soso.maps.Geocoder();
       var latLng = new soso.maps.LatLng(lat, lon);
	   geocoder.geocode({'location':latLng}, function(results, status) {
        if (status == soso.maps.GeocoderStatus.OK) {
		    $("#address").val(results.address);			
		}else{
		    $("#address").val(status);
		    //alert("soso检索没有结果，原因: " + status);
		}
      });
	}