function strikeClick(id){
        if (id == "patternSelected") {
            $("#patternSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x 0px -2px","padding-bottom":"9px"});//,"border-left-color":"#7db9be","border-right-color":"#7db9be"
            $("#mapSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#systemSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#pic").css({"background":"url('./resource/images/piccenter.png') repeat-x","padding-bottom":"9px"});
            $("#template").css("display","block");
            $("#maproperties").css("display","none");
            $("#systemProperties").css("display","none");
        } else if (id == "mapSelected"){
            $("#mapSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x 0px -2px","padding-bottom":"9px"});//,"border-left-color":"#7db9be","border-right-color":"#7db9be"
            $("#patternSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#systemSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#pic").css({"background":"url('./resource/images/piccenter.png') repeat-x","padding-bottom":"9px"});
            $("#template").css("display","none");
            $("#maproperties").css("display","block");
            $("#systemProperties").css("display","none");
        } else if (id == "systemSelected") {
               $("#systemSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x 0px -2px","padding-bottom":"9px"});//,"border-left-color":"#7db9be","border-right-color":"#7db9be"
            $("#mapSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#patternSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#pic").css({"background":"url('./resource/images/piccenter.png') repeat-x","padding-bottom":"9px"});
            $("#template").css("display","none");
            $("#maproperties").css("display","none");
            $("#systemProperties").css("display","block");
        }
}
    function clears(id) {
        document.getElementById(id).value = "";
    }

    function searchtypechange(value) {
        if (value == "tiled" || value == "wms" || value == "arcgis") {
            $("#layerpara").show();
        } else {
            $("#layerpara").hide();
        }

    }

    function geolocation() {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (position) {
                document.getElementById("lon").value = position.coords.longitude;
                document.getElementById("lat").value = position.coords.latitude;
            });
        }  
    }
    var url=[];
    var count=1;
    function add(){
	var a = document.getElementById("layername");
	var b = document.getElementById("layerurl");
	var c = document.getElementById("layertype");
        var strName = a.value;
        var strUrl = b.value;
	var type = c.value;
	//var count = url.length+1;
	if(!strName||strName==""){
		strName = "map_"+count;
	}
	if((type=="tiled"||type=="wms"||type=="arcgis")&&(!strUrl||strUrl=="")){
		alert("url路径不能为空");
		return false;
	}
        var danUrl=new Array();
        if(strName!="名称"&&strUrl!="Url路径"){
            danUrl[0]=strName;
            danUrl[1]=strUrl;
            danUrl[2]=type;
	    danUrl[3]="layer_"+count;
	    url.push(danUrl);
	    var type1='';
	    switch(type){
		case "tiled":type1 = "iserver";break;
		case "cloud":type1 = "SuperMap CloudLayer";break;
		case "tdtlayer":type1 = "天地图";break;
		case "wms":type1 = "WMS";break;
		case "google":type1 = "Google Maps";break;
		case "osm":type1 = "OpenStreet";break;
		case "arcgis":type1 = "ArcGIS online";break;
	    }
	    showlayerinfo(strName,strUrl,type1,count);
	    a.value = b.value = "";
	    count++;
        }
    }
    
    function showlayerinfo(layername,layerurl,layertype,count){
	var a,b;
	
	a = $("#layerinfo");
	a.css("display","block");
	if(layerurl){
		if(layerurl.length>50){
			layerurl = layerurl.substring(0,50);
			layerurl += "..";
		}
		//layerurl = "，" + layerurl;
	}
	//var htmlsr = "<div style=\"margin:0px 0px 10px 10px;color:#fff;\"><span style=\"margin-left:10px;\">"+layername+"</span><span>"+layerurl+"</span></div>"
	var htmlstr = "<div id=\"layerlist_"+count+"\" style=\"margin:0px 0px 10px 10px;color:#000;\"><span style=\"display:inline-block;\"><span style=\"margin-left:10px;\">"+layertype+"，</span><span style=\"margin-left:10px;\">"+layername+"</span>"
	if(layerurl&&layerurl!=""){
		htmlstr += "<span>，"+layerurl+"</span>";
	}
	htmlstr += "</span><span style=\"display:inline-block;margin-left:10px;\"><input type=\"button\" onclick=\"deleteLayer("+count+")\" value=\"删除\"></input></span></div>";
	b = $(htmlstr);
	a.append(b);
    }
    
    function deleteLayer(count){
	var a;
	$("#layerlist_"+count).remove();
	for(var i=0;i<url.length;i++){
		var a = url[i];
		if(a&&a[3]&&a[3]=="layer_"+count){
			url.splice(i,1);
			break;
		}
	}
    }
    
    var controls=new Array();
    function selectedControl(id){
	var controlInfo=$("#"+id);
	if($("#"+id).hasClass('btn-success2'))
	{
		$("#"+id).attr('class', 'btn express2');
		$("#"+id+"r").css("display","block");
		controls.push(id);
	} else{
		$("#"+id).attr('class', 'btn btn-success2 express');
		$("#"+id+"r").css("display","none");
		var index=indexof(controls,id);
		controls.splice(index,1);
	}
    }
    
    var tools=new Array();
    function selectedTool(id){
        var controlInfo=$("#"+id);
	if($("#"+id).hasClass('btn-success2'))
	{
		$("#"+id).attr('class', 'btn express2');
		$("#"+id+"r").css("display","block");
		tools.push(id);
	} else{
		$("#"+id).attr('class', 'btn btn-success2 express');
		$("#"+id+"r").css("display","none");
		var index=indexof(tools,id);
		tools.splice(index,1);
	}
    }
    function indexof(array,value){
        var index;
        for(var i = 0,len = array.length;i<len;i++){
            if(array[i] === value){
                index = i;
            }
        }
        return index;
    }
    
	function search(value){
		var toolName;
		if(value === "查询"){
			toolName="search";
		}else if(value === "量算"){
			toolName="measure";
		}else if(value === "定位"){
			toolName="location";
		}else if(value === "专题图"){
			toolName="themeLabel";
		}else if(value === "标注"){
            toolName = "markers";
        }
		return toolName;
	}
	function searchTwo(value){
	    var controlName;
		if(value === "比例尺"){
		    controlName="ScaleLine";
		}else if(value === "缩放控件"){
		    controlName="PanZoomBar";
		}else if(value === "导航控件"){
		    controlName="Navigation";
		}else if(value === "图例管理控件"){
		    controlName="LayerSwitcher";
		}else if(value === "鹰眼"){
		    controlName="OverviewMap";
		}
		return controlName;	
	}
    
    function clears(){
        document.getElementById("layername").value="";
        document.getElementById("layerurl").value="";
	url=[];
	var a = $("#layerinfo");
	a.empty();
	a.css("display","none");
    }
    function generate_custom() {
        $("#pic").css({"background":"url('./resource/images/selectedpic.png') repeat-x","padding-bottom":"15px"});
        var strXMLHeader = "<config>";
        var strLon = document.getElementById("lon").value.toString();
        var strLat = document.getElementById("lat").value.toString();
        var strzoom = document.getElementById("zoom").value.toString();

        var strMap = "<map LonLat=\"" + strLon + " , " + strLat + "\" Zoom=\"" + strzoom + "\">";
        var strLayer = "<BaseLayers>"; ;
        for(var i=0,len=url.length;i<len;i++){
            var strlayertype=url[i][2];
            var strName = url[i][0];
            var strUrl = url[i][1];
            if (strlayertype == "tiled") {
                strLayer = strLayer + "<layer name=\"" + strName + "\" type=\"tiled\" url=\"" + strUrl + "\" />";
            } else if (strlayertype == "wms") {
                strLayer = strLayer + "<layer name=\"" + strName + "\" type=\"wms\" url=\"" + strUrl + "\" />";
            } else if (strlayertype == "arcgis") {
                strLayer = strLayer + "<layer name=\"" + strName + "\" type=\"arcgis\" url=\"" + strUrl + "\" />";
            }
            else {
                strLayer = strLayer + "<layer type=\"" + strlayertype + "\" />";
            }
        }
        if(url.length==0){
            strlayertype = document.getElementById("layertype").value;
            strLayer = strLayer + "<layer type=\"" + strlayertype + "\" />";
        }
        
        strLayer = strLayer + "</BaseLayers>";
        var strControl = "<Controls>";
        for(var i = 0,len = controls.length;i<len;i++){
		controlsValue = searchTwo(document.getElementById(controls[i]+"t").innerHTML);
		strControl = strControl + "<" + controlsValue +"/>";
        }
        strControl = strControl + "</Controls>";
        strMap = strMap + strLayer + strControl + "</map>";

        var strTitle = document.getElementById("title").value;
        var strBase;
        
        if(base=="base1"){
            base="base0";
        }else if(base=="base2"){
            base="base1";
        }else if(base=="base3"){
            base="base2";
        }
        strBase = "<template src=\"./base/" + base + ".html\" />";

        var strservertype = document.getElementById("servertype").value;
        var strServerXML = "<server_use>Tomcat</server_use>";
        if (strservertype == "Tomcat") {
            strServerXML = "<server_use>Tomcat</server_use>";
        } else if (strservertype == "IIS") {
            strServerXML = "<server_use>IIS</server_use>";
        }

        var strPageName = document.getElementById("pagename").value;
		var panelManager="<panelmanager id=\"panelmanager\">"
		for(var i = 0,len = tools.length;i<len;i++){
			controlsValue = search(document.getElementById(tools[i]+"t").innerHTML);
            panelManager = panelManager + "<panel id=\""+controlsValue+"\" path=\"./models/"+controlsValue+"/\" />";
        }
		panelManager = panelManager+"</panelmanager>";
        var strLayout = "<layout><page_name>" + strPageName + "</page_name><title>" + strTitle + "</title>" + strBase + strServerXML + panelManager+"</layout>";
        var strXML = strXMLHeader + strMap + strLayout + "</config>";
        var xmlDoc = null;
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(strXML);
        }
        catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(strXML, "text/xml");
            }
            catch(e){}
        }
        generate_xml(xmlDoc);
    }
    
function generate_xml(xml){
    var strControls = [];
    var strBaseLayers = [];
    var strPanelsHTML = [];
    var strPanelsIniJS = [];
    var strPanelsJS = [];
    var strControlsMessage = "{ controls: [ ";
    var strMap;
    var strPosition;
    var strUrl;
    var strInsertscript = "";
    var strXML = xml;
    $(xml).find("Controls").children().each(function (i) {
        if (this.nodeName == "Navigation") {
            strControls[i] = "new SuperMap.Control." + "Navigation({ dragPanOptions: { enableKinetic: true } })";
        }
        else {
            strControls[i] = "new SuperMap.Control." + this.nodeName + "()";
        }
    });

    for (var i = 0; i < strControls.length; i++) {
        if (i == strControls.length - 1) {
            strControlsMessage = strControlsMessage + strControls[i];
        }
        else {
            strControlsMessage = strControlsMessage + strControls[i] + ",\n";
        }
    }
    strControlsMessage = strControlsMessage + " ], units: 'm'}\n";
    strMap = "map = new SuperMap.Map('map'," + strControlsMessage + ");\n";
                            
    var nCloudNumber = [];
	var strIServerLayer = [];
    $(xml).find("BaseLayers").children().each(function (i) {
        var strType, strName;
        strType = $(this).attr('type');
        if (strType == "cloud") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.CloudLayer();\n";
            nCloudNumber.push(i); 
        }
        else if (strType == "tiled") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');

            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.TiledDynamicRESTLayer(' " + strName + "','" + strUrl + "', { transparent: true, cacheEnabled: true }, { maxResolution: 'auto' });\n";
			strIServerLayer.push(i);
        } else if (strType == "tdtlayer") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.TDTLayer();\n";
            nCloudNumber.push(i); 
            strInsertscript = "<script src=\"./js/TDTLayer.js\" >" + "</script" + ">\n";
        } else if (strType == "google") {
            strBaseLayers[i] = " layer" + i + " = new OpenLayers.Layer.Google();\n";
            nCloudNumber.push(i);  
            strInsertscript = "<script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAjpkAC9ePGem0lIq5XcMiuhR_wWLPFku8Ix9i2SXYRVK3e45q1BQUd_beF8dtzKET_EteAjPdGDwqpQ'>" + "</script" + ">\n";
        } else if(strType == "osm") {
            strBaseLayers[i] = " layer" + i + " = new OpenLayers.Layer.OSM();\n";
            nCloudNumber.push(i); 

        } else if (strType == "wms") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');
            strBaseLayers[i] = "layer" + i + " = new SuperMap.Layer.WMS('" + strName + "'," + "url" + ", {layers: 'basic'});\n";
            nCloudNumber.push(i); 
        } else if (strType == "arcgis") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');
            strBaseLayers[i] = "layer" + i + " = new OpenLayers.Layer.ArcGISCache('" + strName + "'," + "url );\n";
            nCloudNumber.push(i); 
        }        

    });
                            
    $(xml).find("map").each(function () {
        var strLL, strZoom;
        $.each(this.attributes, function (i, attrib) {
            if (attrib.name == "LonLat") {
                strLL = "new SuperMap.LonLat(" + attrib.value + ")";
            }
            else if (attrib.name == "Zoom") {
                strZoom = attrib.value;
            }
        });

        if(strLL == undefined)
        {
            var strLon = document.getElementById("lon").value;
            var strLat = document.getElementById("lat").value;
            strLL = "new SuperMap.LonLat(" + strLon + "," + strLat + ")";
        }
        if(strZoom == undefined)
        {
            strZoom = document.getElementById("zoom").value;
        }

        strPosition = strLL + " , " + strZoom;
    });
                            
    var strInitFun = "function init() {\n " + strMap;
	
	for (var i = 0; i < strIServerLayer.length; i++) {
        strInitFun = strInitFun + strBaseLayers[strIServerLayer[i]] + "\n";
		strInitFun = strInitFun + "layer" + strIServerLayer[i] + ".events.on({ 'layerInitialized': addLayer });\n";
    }
    for (var i = 0; i < nCloudNumber.length; i++) {
        strInitFun = strInitFun + strBaseLayers[nCloudNumber[i]] + "\n";
        strInitFun = strInitFun + "map.addLayer(layer" + i + ");\n";
    }
	
	if(strIServerLayer.length==0)
	{
		strInitFun = strInitFun + "map.setCenter(" + strPosition + "); \n";
	}

    /*
    if (nCloudNumber != -1) {
        strInitFun = strInitFun + "map.addLayer(layer" + nCloudNumber + ");\n";
        strInitFun = strInitFun + "map.setCenter(" + strPosition + "); \n";
    }

    if (strBaseLayers.length > 0) {
        strInitFun = strInitFun + "layer0.events.on({ 'layerInitialized': addLayer });\n";
    }
    */
    strInitFun = strInitFun + "}\n";

    var strVar = "var map";
    for (var i = 0; i < strBaseLayers.length; i++) {
        strVar = strVar + ", " + "layer" + i;
    }
    strVar = strVar + ";\n";
    if (strUrl != "" && strUrl != null && strUrl != undefined) {
        if (strUrl.length != 0) {
            strVar = strVar + "var url = " + "\"" + strUrl + "\"" + ";\n"
        }
    }
    strInitFun = strVar + strInitFun;

    var strLayer = "";
	if(strIServerLayer.length>0)
	{
		strLayer = "map.addLayer(layer" + strIServerLayer[0] + ");\n";
	}
    /*
    if (strBaseLayers.length == 1) {
        strLayer = "map.addLayer(layer0);\n"
    }
    else {
        strLayer = "";
    }
    */

    var strAddLayerFun = " function addLayer() { \n" + strLayer + "\n map.setCenter(" + strPosition + "); \n}\n";
                            
    var strPanelHTML, strPanelJS, strPanelIniJS;
    $.get("./template/panel.html", null, function (data) {
        data = unescape(data);
        strPanelHTML = data;

        $.get("./template/panel_js.html", null, function (data) {
            data = unescape(data);
            strPanelIniJS = data;

            //遍历XML中panelmanager节点的孩子，添加相对应的功能，其中id没有用到，主要是path属性
            $(xml).find("panelmanager").children().each(function (i) {
                //获取功能路径
                var strConfig = $(this).attr('path');

                //在路径不为空的前提下进行下边操作，如果为空那么就不做处理，相应没有功能按钮出现
                if (strConfig !== "") {

                    //获取html中的数据
                    var strUrl1 = strConfig + "panel.html";
                    $.get(strUrl1, null, function (data) {
                        strPanelsHTML[i] = data;
                    });
                    //获取js文件中的数据
                    strUrl2 = strConfig + "panel.js";
                    $.get(strUrl2, null, function (data) {
                        strPanelsJS[i] = data;
                    });
                }
            });
            var strTemplateFile = $(xml).find("template").attr("src");
            $.get(strTemplateFile, null, function (data) {
                data = unescape(data);
                var strTitle = $(xml).find("title").text();
                var str_page_name = $(xml).find("page_name").text();

                strResult = "";
                for (var i = 0; i < strPanelsHTML.length; i++) {
                    strResult = strPanelsHTML[i] + "\n" + strResult;
                }

                /*将pannel中html字符串和添加的a标签连起来，并在最后添加上我们之前省掉的两个div尾部*/
                strResult = strPanelHTML + strResult + "\n</div>\n</div>";

                var strInitLayerFun = " \nfunction initLayer() { \n";
                for (var i = 0; i < strPanelsIniJS.length; i++) {
                    strInitLayerFun = strInitLayerFun + strPanelsIniJS[i] + "\n";
                }

                /*将pannel中js字符串添加到页面js字符串中*/
                strInitLayerFun = strInitLayerFun + strPanelIniJS + "}\n";

                var strResult = strResult + strInsertscript + "<" + "script" + ">" + "\n" + strInitFun + strAddLayerFun + strInitLayerFun + "\n";
                for (var j = 0; j < strPanelsJS.length; j++) {
                    strResult = strResult + strPanelsJS[j] + "\n";
                }
                strResult = strResult + "</script" + ">\n";
                data = data.replace("<title></title>", "<title>" + strTitle + "</title>");

                data = data.split("</body>")[0] + "\n" + strResult + "</body>" + "\n" + "</html>";

                var str_server_use = $(xml).find("server_use").text();
                var str_server = "jsp";
                if (str_server_use === "IIS") {
                    str_server = "asp"
                } else if (str_server_use === "Tomcat") {
                    str_server = "jsp";
                }

                $.post("./index." + str_server,
                { text: unescape(data), page_name: str_page_name + ".html" },
                function (value) {
                    window.location = "./" + str_page_name + ".html";
                });
            });
        });

    });
}
