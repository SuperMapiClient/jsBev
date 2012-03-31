var quert_html_range_sql,queryType_sql=1;
function js_bev_search_step(){
	$("#panel_handle > h4").fadeOut(200);
	$("#panel_handle").css("background-image","url('./images/frameimages/search.png')");
	$("#back").fadeIn(200);
	
	queryHtml = $("#jsBev_sample").html();
	$("#back").attr("onClick","searchBack()");
    var text="<p class='button3' id='searchByBounds' onclick='clickChaXun()'>范围查询</p>";
	text += "<p class='button3' id='searchBySQL' onClick='clickSql()'>SQL查询</div>";
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		$("#panel_handle > h4").text("查询功能").fadeIn(200);
		$("#jsBev_sample").html(text).animate({"opacity":"1"},200);
	});
}
//查询功能
function clickChaXun(){
	$("#back").attr("onClick","searchBack_to_step()");
	quert_html_range_sql = $("#jsBev_sample").html();
	var text="<p class='fontstyle' >图层名称</p><input class='input' type='text' id='nametext' value='Capitals@World.1' />"
	text+="<p class='button4' onclick=js_Bev_Query() >查询</p><p class='button4' onclick='js_Search_clearFeatures()' >清除</p>"
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		queryType_sql=1;
		$("#jsBev_sample").html(text).animate({"opacity":"1"},200);
	});
}
function clickSql(){
	$("#back").attr("onClick","searchBack_to_step()");
	quert_html_range_sql = $("#jsBev_sample").html();
	var text="<div><p class='fontstyle' >图层名称</p>";
	text+="<input class='input' type='text' id='nametext' value='Countries@World.1'/></div>"
	text+="<p class='fontstyle' >SQL语句</p>";
	text+="<input class='input' type='text' id='sqltext' value='Pop_1994>1000000000 and SmArea>900'/>";
	text+="<p class='button4' onclick='js_Bev_Query()'>查询</p><p class='button4' onclick='js_Search_clearFeatures()'>清除</p>";
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		$("#jsBev_sample").html(text).animate({"opacity":"1"},200);
	});
	queryType_sql++;
}

function searchBack() {
	$("#panel_handle > h4").fadeOut(200);
	$("#panel_handle").css("background-image","url('./images/frameimages/chilun.png')");
	$("#back").fadeOut(200);
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		$("#panel h4").text("功能面板").fadeIn(200);
		$("#jsBev_sample").html(queryHtml).animate({"opacity":"1"},200);
	});
}

function searchBack_to_step(){
	$("#back").attr("onClick","searchBack()");
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		$("#jsBev_sample").html(quert_html_range_sql).animate({"opacity":"1"},200);
	});
}

var queryHtml;
var js_Search_vectorLayer, control, queryBounds, js_Search_markerLayer;
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

    if (queryType_sql == 1) {
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
    var value = document.getElementById("panel").value;
    var i, j, result = queryEventArgs.result; //queryEventArgs服务端返回的对象
    if (result && result.recordsets) {
        for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
            if (recordsets[i].features) {
                for (j = 0; j < recordsets[i].features.length; j++) {
                    if (queryType_sql == 1) {
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