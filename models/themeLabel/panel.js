function js_bev_themeLabel(){
    $("#panel_handle > h4").fadeOut(200);
	$("#panel_handle").css("background-image","url('./images/frameimages/themeMap.png')");
	$("#back").fadeIn(200);
	
	queryHtml = $("#jsBev_sample").html();
	$("#back").attr("onClick","searchBack()");
    var text="<p class='button3' id='createThemeLabel' onclick='addThemeLabel()'>创建专题图</p>";
	text += "<p class='button3' id='cancelThemeLabel' onClick='removeTheme()'>清除专题图</div>";
	$("#jsBev_sample").animate({"opacity":"0"},200,function(){
		$("#panel_handle > h4").text("专题图").fadeIn(200);
		$("#jsBev_sample").html(text).animate({"opacity":"1"},200);
	});
}

        function addThemeLabel() {
            removeTheme();
            var themeService = new SuperMap.REST.ThemeService(url, {eventListeners:{"processCompleted": themeCompleted, "processFailed": themeFailed}});
            style1 = new SuperMap.REST.ServerTextStyle({
                fontHeight: 4,
                foreColor: new SuperMap.REST.ServerColor(100,20,50),
                sizeFixed: true,
                bold:true,
                
            }),
            style2 = new SuperMap.REST.ServerTextStyle({
                fontHeight: 4,
                foreColor: new SuperMap.REST.ServerColor(250,0,0),
                sizeFixed: true,
                bold:true,
            }),
            style3 = new SuperMap.REST.ServerTextStyle({
                fontHeight: 4,
                foreColor: new SuperMap.REST.ServerColor(93,95,255),
                sizeFixed: true,
                bold:true,
            }),
            themeLabelIteme1 = new SuperMap.REST.ThemeLabelItem({
                start: 0.0,
                end: 7800000,
                style: style1
            }),
            themeLabelIteme2 = new SuperMap.REST.ThemeLabelItem({
                start: 7800000,
                end: 15000000,
                style: style2
            }),
            themeLabelIteme3 = new SuperMap.REST.ThemeLabelItem({
                start: 15000000,
                end:   30000000,
                style: style3
            }),
            
            themeLabelIteme4 = new SuperMap.REST.ThemeLabelItem({
                start: 0.0,
                end: 55,
                style: style1
            }),
            themeLabelIteme5 = new SuperMap.REST.ThemeLabelItem({
                start: 55,
                end: 109,
                style: style2
            }),
            themeLabelIteme6 = new SuperMap.REST.ThemeLabelItem({
                start: 109,
                end:   300,
                style: style3
            }),
            themeLabelOne = new SuperMap.REST.ThemeLabel({
                labelExpression: "CAPITAL",
                rangeExpression: "SMID",
                numericPrecision: 0,
                items: [themeLabelIteme4, themeLabelIteme5, themeLabelIteme6],
            }),
            themeLabelTwo = new SuperMap.REST.ThemeLabel({
                labelExpression: "CAP_POP",
                rangeExpression: "CAP_POP",
                numericPrecision: 0,
               items: [themeLabelIteme1, themeLabelIteme2, themeLabelIteme3],
            }),
            //创建矩阵标签元素
            LabelThemeCellOne=new SuperMap.REST.LabelThemeCell({
                themeLabel: themeLabelOne,
            }),
            LabelThemeCellTwo=new SuperMap.REST.LabelThemeCell({
                themeLabel: themeLabelTwo,
            }),
            
            backStyle=new SuperMap.REST.ServerStyle({
                fillForeColor: new SuperMap.REST.ServerColor(255,255,0),
                fillOpaqueRate: 60,
                lineWidth: 0.1,
            })
            //创建矩阵标签专题图
            themeLabel = new SuperMap.REST.ThemeLabel({
                 matrixCells: [[LabelThemeCellOne],[LabelThemeCellTwo]],
                 background:new SuperMap.REST.ThemeLabelBackground({
                    backStyle: backStyle,    
                    labelBackShape:"RECT",
                 })
            }),
            themeParameters = new SuperMap.REST.ThemeParameters({
                themes: [themeLabel],
                datasetNames: ["Capitals"],
                dataSourceNames: ["World"],       
            });
            themeService.processAsync(themeParameters);
        }
		var themeLayer;
        function themeCompleted(themeEventArgs) {
           if(themeEventArgs.result.resourceInfo.id) {
                themeLayer = new SuperMap.Layer.TiledDynamicRESTLayer("各国首都矩阵标签专题图", url, {cacheEnabled:false,transparent: true,layersID: themeEventArgs.result.resourceInfo.id}, {"maxResolution":"auto"});
                themeLayer.events.on({"layerInitialized":addThemelayer});                
            }
        }
        function addThemelayer() {
			map.allOverlays = true;
            map.addLayer(themeLayer);
        }
        
        function themeFailed(serviceFailedEventArgs) {
            alert(serviceFailedEventArgs.error.errorMsg);
        }
        
        function removeTheme() {
            if (map.layers.length > 1) {
                map.removeLayer(themeLayer, layer0);
            }
        }