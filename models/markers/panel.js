//添加标注功能
var markersHtml,vectorLayer,drawPoint;
function js_bev_markers() {
    $("#panel_handle > h4").fadeOut(200);
    $("#panel_handle").css("background-image","url('./images/frameimages/mark.png')");
    $("#back").fadeIn(200);
    
    $("#back").attr("onClick","markersBack()");
    $("#jsBev_sample").hide();
    
    markersHtml = $("#jsBev_sample").html();
    var text="";
    var storage = window.localStorage;
    text += "<p id='measureDistance' class='button3' onClick='addMarkers()'>添加标注</p>";
    text += "<div class='bookMakers'>"+showStorage(storage);
    text += "</div>";

    $("#jsBev_sample").animate({"opacity":"0"},200,function(){
        $("#panel_handle > h4").text("标注").fadeIn(200);
        $("#jsBev_sample").html(text).animate({"opacity":"1"},200);
    });
    
    //初始化control
    vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
    drawPoint = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
    drawPoint.events.on({ "featureadded": drawCompleted });
    map.addControl(drawPoint);
}

function showStorage(storage){
    var contentText="";
    if(storage.length!=0){
        for(var i = 0,length = storage.length;i < length;i++){
            var strContent,contentStr;
            strContent = storage.getItem(storage.key(i)).split(",");
            contentStr = "<div class='contentId' ><div class='contentPic' id='" + storage.key(i) + "' onclick='removeDiv(id)'></div><div style = 'font-weight: bold;height: 15px;' id='"+replaceFun1(storage.key(i))+"' onclick = 'locatePoint(true,id)'>" + strContent[0] + "</div><div id = '"+replaceFun(storage.key(i))+"' onclick = 'locatePoint(false,id)'>" + strContent[2] + ","+ strContent[3] + "</div></div>";
            contentText += contentStr;
        }
    }
    return contentText;
}

function replaceFun(str){
    var resultStr = str.split("contentID")[1];
    return "showID"+resultStr;
}

function replaceFun1(str){
    var resultStr = str.split("contentID")[1];
    return "secShowID"+resultStr;
}

function markersBack() {
    $("#panel_handle > h4").fadeOut(200);
    $("#panel_handle").css("background-image","url('./images/frameimages/chilun.png')");
    $("#back").fadeOut(200);
    
    $("#jsBev_sample").hide();
    if (polygonLayer) {
        polygonLayer.removeAllFeatures();
    }
    if (lineLayer) {
        lineLayer.removeAllFeatures();
    }
    
    $("#jsBev_sample").animate({"opacity":"0"},200,function(){
        $("#panel_handle > h4").text("功能面板").fadeIn(200);
        $("#jsBev_sample").html(markersHtml).animate({"opacity":"1"},200);
    });
}

//添加标注
var js_bev_markerLayers;
function addMarkers(){
    if(!js_bev_markerLayers){
        js_bev_markerLayers = new SuperMap.Layer.Markers("Markers");
         map.addLayer(js_bev_markerLayers);
    }
    js_bev_markerLayers.clearMarkers();
    if(map.popups.length != 0){
        map.removePopup(map.popups[0]);
    }
    drawPoint.activate();
}
var point,featureMarkers;
function drawCompleted(drawGeometryArgs) {
        point = drawGeometryArgs.feature.geometry;
        var size = new SuperMap.Size(32,32),
        offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
        icon = new SuperMap.Icon("./images/frameimages/markers.png", size, offset);
    js_bev_markerLayers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
    //弹出对话框
    var featureLength = vectorLayer.features.length;
    featureMarkers = vectorLayer.features[featureLength-1];
    var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>" + 
                      "<span style='font-weight: bold; font-size: 18px;'>标注信息</span><br>";
    contentHTML += "标题："  + "<input  type='text' id='titleId' value='标注' /><br>";
    contentHTML += "内容："  + "<input type = 'text' id='titleCotent' style='height: 35px'>";
    contentHTML += "<br>"  +  "<div type = 'button' class = 'btn-success2' onclick='clickDefine()' >确定</div>" + "</div>";
    //初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
    popup = new SuperMap.Popup.FramedCloud("chicken", 
                                featureMarkers.geometry.getBounds().getCenterLonLat(),
                                null,
                                contentHTML,
                                null,
                                true);
    featureMarkers.popup = popup;
    map.addPopup(popup);
    $("#chicken_close").css({"visibility":"hidden"});
    drawPoint.deactivate();
}

function clickDefine(){
    var storage = window.localStorage;
    if(storage.length == 0){
        storage["contentID0"]=$("#titleId")[0].value+","+$("#titleCotent")[0].value+","+(point.x).toFixed("2")+","+(point.y).toFixed("2") + "," + map.getZoom();
         var contentStr="<div class='contentId'><div class='contentPic' id = 'contentID0' onclick = 'removeDiv(id)'></div><div style = 'font-weight: bold;height: 15px;' id='secShowID0' onclick = 'locatePoint(true,id)'>"+$("#titleId")[0].value+"</div><div id='showID0' onclick = 'locatePoint(false,id)'>"+(point.x).toFixed("2")+","+(point.y).toFixed("2")+"</div></div>";
    }else{
        storage["contentID"+newId(false,storage)]=$("#titleId")[0].value+","+$("#titleCotent")[0].value+","+(point.x).toFixed("2")+","+(point.y).toFixed("2") + "," + map.getZoom();
         var contentStr="<div class='contentId'><div class='contentPic' id = 'contentID" + newId(true,storage) + "' onclick = 'removeDiv(id)'></div><div style = 'font-weight: bold;height: 15px' id='secShowID"+newId(true,storage)+"' onclick = 'locatePoint(true,id)'>"+$("#titleId")[0].value+"</div><div id='showID"+newId(true,storage)+"' onclick = 'locatePoint(false,id)'>"+(point.x).toFixed("2")+","+(point.y).toFixed("2")+"</div></div>";
    }
    var contentObject=$(contentStr);
    $(".bookMakers").append(contentObject);
    
    map.removePopup(featureMarkers.popup);
    featureMarkers.popup.destroy();
    featureMarkers.popup = null;
    js_bev_markerLayers.clearMarkers();
}

function removeDiv(id){
    $("#" + id + "").parent().remove();
    var storage = window.localStorage;
    var removeStorage = storage.getItem(id);    
    storage.removeItem(id);
    
    var markers = js_bev_markerLayers.markers,
        arrStorage = removeStorage.split(",");
    for(var i = 0 , markersLength = markers.length; i < markersLength; i++){
        if(markers[i].lonlat.lat == parseFloat(arrStorage[3]) && markers[i].lonlat.lon == parseFloat(arrStorage[2])){
            js_bev_markerLayers.removeMarker(markers[i]);
        }
    }
    if(map.popups.length != 0){
        map.removePopup(map.popups[0]);
    }
}
function newId(str,strStorage){
    var returnStr = strStorage.key(0).split("contentID")[1];
    for(var i=0,len = strStorage.length;i < len; i++){
        var compareStr = strStorage.key(i).split("contentID")[1];
        if(parseInt(compareStr) > parseInt(returnStr)){
            returnStr = compareStr;
        }
    }
    if(str == true){
        returnStr =parseInt(returnStr);
    }else{
        returnStr =parseInt(returnStr)+1;
    }
    return returnStr;
}
this.win = new InforWindow_z({"map":map});
function locatePoint(str,idstr){
    if(!js_bev_markerLayers){
        js_bev_markerLayers = new SuperMap.Layer.Markers("Markers");
         map.addLayer(js_bev_markerLayers);
    }
    if(str == true){
        var resultStr = idstr.split("secShowID")[1];
    }else{
        var resultStr = idstr.split("showID")[1];
    }
    var storage = window.localStorage,
        markers = js_bev_markerLayers.markers;
    strContent = storage.getItem("contentID"+resultStr).split(",");
    if(decidetrue(markers,js_bev_markerLayers,strContent)){
        map.setCenter(new SuperMap.LonLat(strContent[2], strContent[3]), strContent[4]);
    }else{
        addMarkerImage(strContent,js_bev_markerLayers);
    }
}
function addMarkerImage(strContent,js_bev_markerLayers){
    if(map.popups.length != 0){
        map.removePopup(map.popups[0]);
    }
    js_bev_markerLayers.clearMarkers();
    var p = new SuperMap.Geometry.Point(parseFloat(strContent[2]),parseFloat(strContent[3]));    
    var size = new SuperMap.Size(32, 32);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var feature = new SuperMap.Feature(js_bev_markerLayers, new SuperMap.LonLat(p.x, p.y));
    feature.data.icon = new SuperMap.Icon("./images/frameimages/markers.png", size, offset);
    
    var marker = feature.createMarker();
    
    var markerClick = function (evt,feature,strContent) {
        SuperMap.Event.stop(evt);
        this.win.open(feature,{
            "name":strContent[0],
            "informition":strContent[1]
        });
    };
    marker.events.register("click", feature, function(feature,strContent){
        return function(evt){
        markerClick(evt,feature,strContent);
        }
    }(feature,strContent));

    js_bev_markerLayers.addMarker(marker);
    map.setCenter(new SuperMap.LonLat(strContent[2], strContent[3]), strContent[4]);
}

function decidetrue(markers,js_bev_markerLayers,strContent){
    var decideTorF = false;
    for(var i = 0 , markersLength = markers.length; i < markersLength; i++){
        if(markers[i].lonlat.lat == parseFloat(strContent[3]) && markers[i].lonlat.lon == parseFloat(strContent[2])){
            decideTorF = true;
        }else{
            
        }
    }
    return decideTorF;
}

function InforWindow_z(param){
    var t = this;
    t.infowin = null;
    t.map = null;
    t.init = function(param){
        for(var key in param){
            t[key] = param[key];
        }
    }
    t.open = function(feature,data){
        t.close();
        t.create(feature,data);
    }
    t.create = function(feature,data){
        var ad = data.informition;
        var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>" + 
                                  "<span style='font-weight: bold; font-size: 18px;'>"+data.name+"</span><br>";
        contentHTML += "<div>&nbsp&nbsp" + ((ad&&ad!=""&&ad!="null")?ad:"无") + "</div></div>";
        //初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
        var popup = new SuperMap.Popup.FramedCloud("chicken", 
                        feature.marker.lonlat,
                        null,
                        contentHTML,
                        null,
                        true);
        feature.popup = popup;
        map.addPopup(popup);
        t.infowin = popup;
    }
    t.close = function(){
        if(t.infowin){
            try{
            t.infowin.hide();
            t.infowin.destroy();
            }
            catch(e){}
        }
    }
    t.init(param);
}