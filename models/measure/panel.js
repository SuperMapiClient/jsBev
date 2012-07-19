var measureHtml;
function js_bev_measure() {
    $("#panel_handle > h4").fadeOut(50);
    $("#panel_handle").css("background-image","url('./images/frameimages/measure.png')");
    $("#back").fadeIn(50);
    
    $("#back").click(function(){measureBack()});
    //$("#back").attr("onClick","measureBack()");
    $("#jsBev_sample").hide();
    
    measureHtml = $("#jsBev_sample").html();
    var text = "<p id='measureResult'></p>";
    text += "<p id='measureDistance' class='button3' onClick='distanceMeasure()'>长度量算</p>";
    text += "<p id='measureArea' class='button3' onClick='AreaMeasure()'>面积量算</p>";

    $("#jsBev_sample").animate({"opacity":"0"},50,function(){
        $("#panel_handle > h4").text("量算功能").fadeIn(50);
        $("#jsBev_sample").html(text).animate({"opacity":"1"},50);
    });
    
    lineLayer = new SuperMap.Layer.Vector("lineLayer");
    lineLayer.style = style;
    drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, { multi: true });
    drawLine.events.on({ "featureadded": drawCompleted1 });
    
    polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
    polygonLayer.style = style;
    drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
    drawPolygon.events.on({ "featureadded": drawCompleted1 });
    map.addLayers([polygonLayer,lineLayer]);
    map.addControls([drawPolygon,drawLine]);
}

function measureBack() {
    clearFeatures();
    $("#panel_handle > h4").fadeOut(50);
    $("#panel_handle").css("background-image","url('./images/frameimages/chilun.png')");
    $("#back").fadeOut(50);
    
    $("#jsBev_sample").hide();
    if (polygonLayer) {
        polygonLayer.removeAllFeatures();
    }
    if (lineLayer) {
        lineLayer.removeAllFeatures();
    }
    
    $("#jsBev_sample").animate({"opacity":"0"},50,function(){
        $("#panel_handle > h4").text("功能面板").fadeIn(50);
        $("#jsBev_sample").html(measureHtml).animate({"opacity":"1"},50);
    });
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
var i=0;
function distanceMeasure() {
    clearFeatures();    
     drawLine.activate();
}

//面积量测
function AreaMeasure() {
    clearFeatures();
    drawPolygon.activate();
}

//绘完触发事件
function drawCompleted1(drawGeometryArgs) {
    //停止画线画面控制
    drawLine.deactivate();
    drawPolygon.deactivate();
    //获得图层几何对象
    var geometry = drawGeometryArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果

    //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
    if (geometry.CLASS_NAME.indexOf("LineString") > -1) {
        myMeasuerService.events.on({ "processCompleted": measureLineCompleted });
        myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
    } else {
        myMeasuerService.events.on({ "processCompleted": measureAreaCompleted });
        myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
    }
    myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
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

function clearFeatures(){
    lineLayer.removeAllFeatures();
    polygonLayer.removeAllFeatures();
    drawLine.deactivate();
    drawPolygon.deactivate();
}