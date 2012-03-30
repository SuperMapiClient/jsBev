var pailieHtml;
function js_bev_measure(){
  pailieHtml=$("#pailie").html();
  var text="<button onClick='distanceMeasure()'>长度</button>";
	  text+="<button onClick='AreaMeasure()'>面积</button>";
	  text+="<button onClick='measureBack()'>返回</button>";
	  text+="<textarea id='measureResult'></textarea>";
  $("#pailie").html(text);
}

function measureBack(){
	if(polygonLayer){
		polygonLayer.removeAllFeatures();
	}
	if(lineLayer){
		lineLayer.removeAllFeatures();
	}
	$("#pailie").html(pailieHtml);
}
/*长度面积测量*/

//定义线与面图层
var lineLayer,polygonLayer;

//定义样式
var style = {
       strokeColor: "#304DBE",
       strokeWidth: 2,
       pointerEvents: "visiblePainted",
       fillColor: "#304DBE",
       fillOpacity: 0.8
}

//距离量测
function distanceMeasure(){
	if(polygonLayer){
		 drawPolygon.deactivate();
	}
	if(lineLayer){
		lineLayer.removeAllFeatures();
		drawLine.activate();
	}
	if(!lineLayer){
		//新建线矢量图层
		lineLayer = new SuperMap.Layer.Vector("lineLayer");
		//对线图层应用样式style（前面有定义）
		lineLayer.style = style;
		//创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
		drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, { multi: true });
		drawLine.events.on({"featureadded": drawLineCompleted});
		map.addLayer(lineLayer);
		map.addControl(drawLine);
		drawLine.activate();
	}
}

//面积量测
function AreaMeasure(){
	if(lineLayer){
		 drawLine.deactivate();
	}
	if(polygonLayer){
		polygonLayer.removeAllFeatures();
		drawPolygon.activate();
	}
	if(!polygonLayer){
		 //新建面矢量图层
		polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
		//对面图层应用样式style（前面有定义）
		polygonLayer.style = style;
		//创建画面控制，图层是polygonLayer
		drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon); 
		drawPolygon.events.on({"featureadded": drawAreaCompleted});
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
       myMeasuerServicePoly.events.on({ "processCompleted": measureAreaCompleted});
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