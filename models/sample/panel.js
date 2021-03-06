﻿var measureHtml;
function js_bev_measure() {
    measureHtml = $("#jsBev_sample").html();
    var text = "<p class='button2' onClick='distanceMeasure()'>长度</p>";
    text += "<p class='button2' onClick='AreaMeasure()'>面积</p>";
    text += "<p class='button2' onClick='measureBack()'>返回</p>";
    text += "<textarea id='measureResult' class='fontstyle' style='width:90%;margin-left:8px' ></textarea>";
    $("#jsBev_sample").html(text).fadeIn(1000); ;
}

function measureBack() {
    if (polygonLayer) {
        polygonLayer.removeAllFeatures();
    }
    if (lineLayer) {
        lineLayer.removeAllFeatures();
    }
    $("#jsBev_sample").html(measureHtml);
}
/*长度面积测量*/

//定义线与面图层
var lineLayer, polygonLayer;

//定义样式
var style = {
    strokeColor: "#304DBE",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "#304DBE",
    fillOpacity: 0.8
}

//距离量测
function distanceMeasure() {
    if (polygonLayer) {
        drawPolygon.deactivate();
    }
    if (lineLayer) {
        lineLayer.removeAllFeatures();
        drawLine.activate();
    }
    if (!lineLayer) {
        //新建线矢量图层
        lineLayer = new SuperMap.Layer.Vector("lineLayer");
        //对线图层应用样式style（前面有定义）
        lineLayer.style = style;
        //创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
        drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, { multi: true });
        drawLine.events.on({ "featureadded": drawLineCompleted });
        map.addLayer(lineLayer);
        map.addControl(drawLine);
        drawLine.activate();
    }
}

//面积量测
function AreaMeasure() {
    if (lineLayer) {
        drawLine.deactivate();
    }
    if (polygonLayer) {
        polygonLayer.removeAllFeatures();
        drawPolygon.activate();
    }
    if (!polygonLayer) {
        //新建面矢量图层
        polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
        //对面图层应用样式style（前面有定义）
        polygonLayer.style = style;
        //创建画面控制，图层是polygonLayer
        drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
        drawPolygon.events.on({ "featureadded": drawAreaCompleted });
        map.addLayer(polygonLayer);
        map.addControl(drawPolygon);
        drawPolygon.activate();
    }
}

//长度绘制完成
function drawLineCompleted(drawGeometryArgs) {
    //停止画控制
    drawLine.deactivate();
    //获得图层几何对象
    var geometryLine = drawGeometryArgs.feature.geometry,
        measureParamLine = new SuperMap.REST.MeasureParameters(geometryLine), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerServiceLine = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
    myMeasuerServiceLine.events.on({ "processCompleted": measureLineCompleted });
    myMeasuerServiceLine.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
    myMeasuerServiceLine.processAsync(measureParamLine); //processAsync负责将客户端的量算参数传递到服务端。
}

//面积绘制完成
function drawAreaCompleted(drawGeometryArgs) {
    //停止画面控制
    drawPolygon.deactivate();
    //获得图层几何对象
    var geometryPoly = drawGeometryArgs.feature.geometry,
       measureParamPoly = new SuperMap.REST.MeasureParameters(geometryPoly), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
       myMeasuerServicePoly = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
    myMeasuerServicePoly.events.on({ "processCompleted": measureAreaCompleted });
    myMeasuerServicePoly.measureMode = SuperMap.REST.MeasureMode.AREA;
    myMeasuerServicePoly.processAsync(measureParamPoly); //processAsync负责将客户端的量算参数传递到服务端。
}

//距离测量结束调用事件
function measureLineCompleted(measureEventArgs) {
    var distance = measureEventArgs.result.distance;
    $("#measureResult").html("长度：" + parseInt(distance) + "米");
}

//面积测量结束调用事件
function measureAreaCompleted(measureEventArgs) {
    var area = measureEventArgs.result.area;
    $("#measureResult").html("面积：" + parseInt(area) + "平方米");
}

var queryHtml;
var js_Search_vectorLayer, control, queryBounds, js_Search_markerLayer, queryType = 1;
function js_bev_search() {
    queryHtml = $("#jsBev_sample").html();
    var text = "<div><select id='search' name='searchtype' style='width:100%' class='fontstyle' onchange=searchtypechange(this.value) ><option value='1'>范围查询</option><option value='2'>SQL查询</option></select></div>";
    text += "<div ><p style='width:100%' class='fontstyle' >图层名称</p><input type='text' id='nametext' value='Capitals@World' style='font-family:微软雅黑;font-size:12px; font-weight:normal;text-decoration:none;' ></div>";
    text += "<div id='sql'><p style='width:100%;' class='fontstyle' >SQL语句</p><input type='text' id='sqltext' value='Pop_1994>1000000000 and SmArea>900' style='font-family:微软雅黑;font-size:12px; font-weight:normal;text-decoration:none;' ></div>";
    text += "<div><p class='button2' onclick=js_Bev_Query() >查询</p><p class='button2' onclick=js_Search_clearFeatures() >清除</p><p class='button2' onclick=searchBack() >返回</p></div>";
    $("#jsBev_sample").html(text).fadeIn(1000); ;

    $("#sql").hide();

    queryType = 1;
}

function searchBack() {
    $("#jsBev_sample").html(queryHtml);
}

function searchtypechange(value) {
    queryType = value;
    if (queryType == 1) {
        $("#sql").hide();
        document.getElementById("nametext").value = "Capitals@World";
    }
    else {
        $("#sql").show();
        document.getElementById("nametext").value = "Countries@World";
    }

}

var js_Search_style = {
    strokeColor: "#304DBE",
    strokeWidth: 1,
    pointerEvents: "visiblePainted",
    fillColor: "#304DBE",
    fillOpacity: 0.3
};

function js_Bev_Query() {
    if (js_Search_vectorLayer) {
        //先清除上次的显示结果
        js_Search_vectorLayer.removeAllFeatures(); //清除矢量地图上的所有特征和元素
    }
    if (js_Search_markerLayer) {
        js_Search_markerLayer.clearMarkers(); //清除图层的标签
    }

    if (!js_Search_vectorLayer) {
        js_Search_vectorLayer = new SuperMap.Layer.Vector("Vector Layer"); //新建一个vectorLayer的矢量图层
        map.addLayer(js_Search_vectorLayer);
    }
    if (!js_Search_markerLayer) {
        js_Search_markerLayer = new SuperMap.Layer.Markers("Markers"); //创建一个有标签的图层
        map.addLayer(js_Search_markerLayer);
    }

    if (queryType == 1) {
        js_Bev_searchByBounds();
    }
    else {
        js_Bev_searchBySQL();
    }
}

function js_Bev_searchByBounds() {
    control = new SuperMap.Control();
    SuperMap.Util.extend(control, {//Util工具类   extend指的是将复制所有的属性的源对象到目标对象
        draw: function () {
            this.box = new SuperMap.Handler.Box(control, { "done": this.notice }); //此句是创建一个句柄，Box是一个处理地图拖放一个矩形的事件，这个矩形显示是开始于在按下鼠标，然后移动鼠标，最后完成在松开鼠标。
            this.box.boxDivClassName = "qByBoundsBoxDiv"; //boxDivClassName用于绘制这个矩形状的图形
            this.box.activate(); //激活句柄
        },
        //将拖动的矩形显示在地图上
        notice: function (bounds) {
            this.box.deactivate(); //处理关闭激活句柄

            var ll = map.getLonLatFromPixel(new SuperMap.Pixel(bounds.left, bounds.bottom)), //getLonLatFromPixel从视口坐标获得地理坐标
                        ur = map.getLonLatFromPixel(new SuperMap.Pixel(bounds.right, bounds.top));
            queryBounds = new SuperMap.Bounds(ll.lon, ll.lat, ur.lon, ur.lat);

            var feature = new SuperMap.Feature.Vector();
            feature.geometry = queryBounds.toGeometry(),
                    feature.style = js_Search_style;
            js_Search_vectorLayer.addFeatures(feature);

            var queryParam, queryByBoundsParams, queryService;
            var strName = document.getElementById("nametext").value;
            queryParam = new SuperMap.REST.FilterParameter({ name: strName }); //FilterParameter设置查询条件，name是必设的参数，（图层名称格式：数据集名称@数据源别名）
            queryByBoundsParams = new SuperMap.REST.QueryByBoundsParameters({ queryParams: [queryParam], bounds: queryBounds }); //queryParams查询过滤条件参数数组。bounds查询范围
            queryService = new SuperMap.REST.QueryByBoundsService(url, {
                eventListeners: {
                    "processCompleted": js_Search_processCompleted,
                    "processFailed": js_Search_processFailed
                }
            });
            queryService.processAsync(queryByBoundsParams); //向服务端传递参数，然后服务端返回对象
        }
    });
    map.addControl(control);
}

function js_Search_processCompleted(queryEventArgs) {
    var value = document.getElementById("search").value;
    var i, j, result = queryEventArgs.result; //queryEventArgs服务端返回的对象
    if (result && result.recordsets) {
        for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
            if (recordsets[i].features) {
                for (j = 0; j < recordsets[i].features.length; j++) {
                    if (queryType == 1) {
                        var point = recordsets[i].features[j].geometry,
                                size = new SuperMap.Size(44, 33),
                                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                                icon = new SuperMap.Icon("./resource/controlImages/marker.png", size, offset);
                        js_Search_markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                    }
                    else
                    {
                         feature = result.recordsets[i].features[j];
                            feature.style = js_Search_style;
                            js_Search_vectorLayer.addFeatures(feature);
                    }
                }
            }
        }
    }
}
function js_Search_processFailed(e) {
    alert(e.error.errorMsg);
}
function js_Search_clearFeatures() {
    if (js_Search_vectorLayer) {
        js_Search_vectorLayer.removeAllFeatures();
    }

    if (js_Search_markerLayer) {
        js_Search_markerLayer.clearMarkers();
    }
}

function js_Bev_searchBySQL() {
    var queryParam, queryBySQLParams, queryBySQLService;
    var strName = document.getElementById("nametext").value;
    var strFilter = document.getElementById("sqltext").value;
    queryParam = new SuperMap.REST.FilterParameter({
        name: strName,
        attributeFilter: strFilter
    }),
    queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
        queryParams: [queryParam]
    }),
    queryBySQLService = new SuperMap.REST.QueryBySQLService(url, {
        eventListeners: { "processCompleted": js_Search_processCompleted, "processFailed": js_Search_processFailed }
    });
    queryBySQLService.processAsync(queryBySQLParams);
}

/*geolocate*/
var geolocateHtml;
var markerLayer;
function js_bev_geoLocation() {
    geolocateHtml = $("#jsBev_sample").html();
    var text = "<div id='geolocate_title' class='fontstyle'>地理定位功能</div>";
    text += "<div class='bev_geolocate_cont' >";
    text += "<span class='fontstyle'>经度：<input id='lon' type='text' style='width:130px'/></span><br/>";
    text += "<span class='fontstyle'>纬度：<input id='lat' type='text'style='width:130px'/></span>";
    text += "</div><div>";
    text += "<p class='button2' id='centerLocate' >地图中心点坐标</p>";
    text += "<p class='button2' id='clear' >清空</p>";
    text += "<p class='button2' id='myLocate' >当前位置</p>";
    text += "<p class='button2' id='gotoLocate' >转到</p>";
    text += "<p class='button2' id='gotoLocate' onclick='js_bev_geoLocation_back()'>返回</p>";
    text += "</div>";
    $("#jsBev_sample").html(text).fadeIn(1000);
    geolocate_event();
}

function js_bev_geoLocation_back() {
    if (markerLayer) {
        markerLayer.clearMarkers();
    }
    $("#jsBev_sample").html(geolocateHtml);
}

//对地理定位功能监听事件封装
function geolocate_event() {
    var geolocate = new OpenLayers.Control.Geolocate({
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

     $("#gotoLocate").click(function () {
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
    });

    $("#myLocate").click(function () {
        geolocate.watch = true;
		geolocate.activate();
    });
	
	geolocate.events.register("locationupdated",geolocate,function(e) {
		$("#lat").val("" + e.point.y + "°");
		$("#lon").val("" + e.point.x + "°");
					
		geolocate.watch = false;
		geolocate.deactivate();
	});
}