var base="base1";
function showpic(value) {
        if (value == "base1") {
            $("#base").css("background-image","url(./images/visual/base0.png)");
            $("#base1").css({"border":"none","background":"none"}).siblings().css({"border":"1px solid #4E5559","background":"url(./resource/images/button1.png) repeat-x"});
            base = "base1";
        } else if (value == "base2"){
            $("#base").css("background-image","url(./images/visual/base1.png)");
            $("#base2").css({"border":"none","background":"none"}).siblings().css({"border":"1px solid #4E5559","background":"url(./resource/images/button1.png) repeat-x"});
            base = "base2";
        } else if (value == "base3") {
            $("#base").css("background-image","url(./images/visual/base2.png)");
            $("#base3").css({"border":"none","background":"none"}).siblings().css({"border":"1px solid #4E5559","background":"url(./resource/images/button1.png) repeat-x"});
            base = "base3";
        }
    }
function strikeClick(id){
        if (id == "patternSelected") {
            $("#patternSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x","padding-bottom":"15px","border-left-color":"#7db9be","border-right-color":"#7db9be"});
            $("#mapSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#systemSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#pic").css({"background":"url('./resource/images/piccenter.png') repeat-x","padding-bottom":"9px"});
            $("#template").css("display","block");
            $("#maproperties").css("display","none");
            $("#systemProperties").css("display","none");
        } else if (id == "mapSelected"){
            $("#mapSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x","padding-bottom":"15px","border-left-color":"#7db9be","border-right-color":"#7db9be"});
            $("#patternSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#systemSelected").css({"background":"url('./resource/images/button1.png') repeat-x","padding-bottom":"9px","border-left-color":"#393e42","border-right-color":"#393e42"});
            $("#pic").css({"background":"url('./resource/images/piccenter.png') repeat-x","padding-bottom":"9px"});
            $("#template").css("display","none");
            $("#maproperties").css("display","block");
            $("#systemProperties").css("display","none");
        } else if (id == "systemSelected") {
               $("#systemSelected").css({"background":"url('./resource/images/buttonselect.png') repeat-x","padding-bottom":"15px","border-left-color":"#7db9be","border-right-color":"#7db9be"});
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
                alert("该值为经纬度单位，可能会与你发布的地图服务单位不一致！");
            });

        } else {
            alert("很遗憾，你的浏览器不支持地理定位功能。");
        }  
    }
    var url=[];
    function add(){
        var strName = document.getElementById("layername").value;
        var strUrl = document.getElementById("layerurl").value;
        var danUrl=new Array();
        if(strName!="名称"&&strUrl!="Url路径"){
            danUrl[0]=document.getElementById("layername").value;
            danUrl[1]=document.getElementById("layerurl").value;
            danUrl[2]=document.getElementById("layertype").value;
            url.push(danUrl);
        }
    }
    var controls=new Array();
    function selectedControl(id){
        var controlInfo=$("#"+id),
        controlsCss=controlInfo.css("background-image"),
        firstContent = controlsCss.lastIndexOf("/"),secondCotent=controlsCss.lastIndexOf(")");
        var imgName = controlsCss.substring(firstContent+1,secondCotent);
        if(imgName==="tool-control_slip.png"||imgName==='tool-control_slip.png"'||imgName==="tool-control.png"||imgName==='tool-control.png"'){
            controlInfo.css("background","url(./resource/images/tool-control-click.png) repeat-x");
            controls.push(id);
        }else{
            controlInfo.css("background","url(./resource/images/tool-control.png) repeat-x");
            var index=indexof(controls,id);
            controls.splice(index,1);
        }
    }
    
    var tools=new Array();
    function selectedTool(id){
        var controlInfo=$("#"+id),
        controlsCss=controlInfo.css("background-image"),
        firstContent = controlsCss.lastIndexOf("/"),secondCotent=controlsCss.lastIndexOf(")");
        var imgName = controlsCss.substring(firstContent+1,secondCotent);
        if(imgName==="tool-control_slip.png"||imgName==='tool-control_slip.png"'||imgName==="tool-control.png"||imgName==='tool-control.png"'){
            controlInfo.css("background","url(./resource/images/tool-control-click.png) repeat-x");
            tools.push(id);
        }else{
            controlInfo.css("background","url(./resource/images/tool-control.png) repeat-x");
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
		}
		return toolName;
	}
    
    function clears(){
        document.getElementById("layername").value="";
        document.getElementById("layerurl").value="";

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
			controlsValue = document.getElementById(controls[i]).innerHTML;
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
			controlsValue = search(document.getElementById(tools[i]).innerHTML);
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
            catch (e) { }
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
                            
    var nCloudNumber = -1;
    $(xml).find("BaseLayers").children().each(function (i) {
        var strType, strName;
        strType = $(this).attr('type');
        if (strType == "cloud") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.CloudLayer();\n";
            nCloudNumber = i; 
        }
        else if (strType == "tiled") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');

            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.TiledDynamicRESTLayer(' " + strName + "','" + strUrl + "', { transparent: true, cacheEnabled: true }, { maxResolution: 'auto' });\n";
        } else if (strType == "tdtlayer") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.TDTLayer();\n";
            nCloudNumber = i; 
            strInsertscript = "<script src=\"./js/TDTLayer.js\" >" + "</script" + ">\n";
        } else if (strType == "google") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.Google();\n";
            nCloudNumber = i; 
            strInsertscript = "<script src='http://maps.google.com/maps/api/js?v=3.3&amp;sensor=false' >" + "</script" + ">\n";
        } else if(strType == "osm") {
            strBaseLayers[i] = " layer" + i + " = new SuperMap.Layer.OSM();\n";
            nCloudNumber = i;

        } else if (strType == "wms") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');
            strBaseLayers[i] = "layer" + i + " = new SuperMap.Layer.WMS('" + strName + "'," + "url" + ", {layers: 'basic'});\n";
            nCloudNumber = i;
        } else if (strType == "arcgis") {
            strUrl = $(this).attr('url');
            strName = $(this).attr('name');
            strBaseLayers[i] = "layer" + i + " = new OpenLayers.Layer.ArcGISCache('" + strName + "'," + "url );\n";
            nCloudNumber = i;
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
    for (var i = 0; i < strBaseLayers.length; i++) {
        strInitFun = strInitFun + strBaseLayers[i] + "\n";
        strInitFun = strInitFun + "map.addLayer(layer" + i + ");\n";
    }
    strInitFun = strInitFun + "map.setCenter(" + strPosition + "); \n";

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
