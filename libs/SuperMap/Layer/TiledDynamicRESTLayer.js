/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * Class: SuperMap.Layer.TiledDynamicRESTLayer
 * SuperMap iServer Java 6R 分块动态 REST 图层。
 *
 * Inherits from:
 *  - <SuperMap.CanvasLayer>
 */

SuperMap.Layer.TiledDynamicRESTLayer = SuperMap.Class(SuperMap.CanvasLayer, {
    
    /**
     * Constant: DEFAULT_PARAMS
     * {Object} 设置到瓦片url请求上的参数的默认值。
     */
    DEFAULT_PARAMS: { 
        maxVisibleVertex: 360000,
        transparent: false,
        cacheEnabled: true
    },
    
    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型。
     * - *layerInitialized* 当初始化 TiledDynamicRESTLayer 时未传入 viewBounds、viewer、scale 参数时，该图层发送获取地图
     * 状态的请求，根据响应信息初始化图层参数。当初始化完成后触发该事件，
     * 用户可以在该事件的响应函数中将该图层添加到地图中。若已经传入 viewBounds、viewer、scale 参数，
     * 则不使用该事件，例如：
     * (start code) 
     *  // options没有设置viewBounds、viewer、scale 参数，则使用下面的方法将图层添加到map         
     *    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("layerName", layerURL, {transparent: true});   
     *  layer.events.on({"layerInitialized": addLayer}); 
     *     function addLayer() {
     *      map.addLayer(layer);
     *      map.setCenter(new SuperMap.LonLat(0, 0), 0);
     *  } 
     * //options中设置了 viewBounds、viewer、scale、units参数，使用如下方法将图层添加到map
     * options = { maxResolution: "auto",
     *             maxExtent: new SuperMap.Bounds(-180,-90,180,90),
     *             viewBounds: new SuperMap.Bounds(115.68907056855075,38.2242637451103,117.43071517366,39.96590835021956),
     *             viewer: new SuperMap.Size(256,256),
     *             scale: 4.399651542605526E-7,
     *             units: 'degrees'
     *  };
     * var layerJingjing = new SuperMap.Layer.TiledDynamicRESTLayer("layerName", layerURL, 
     *     {transparent: true, cacheEnabled: true}, options);    
     * (end)     
     */
    EVENT_TYPES: ["layerInitialized"],
    
    /**
     * Property: prjStr
     * {String}
     * 投影键值串，在图层初始化完成时赋值。例如：prjCoordSys={"epsgCode":3857}
     * 内部使用，不公开
     */
    prjStr1: null,

    /**
     * Property: getmapstatusservice
     * {String}
     */
    getMapStatusService: null,
    
    /**
     * APIProperty: viewBounds
     * {Object} 地图窗口显示区域的范围。
     */
    viewBounds: null,
    
    /**
     * APIProperty: viewer
     * {Object} 用户显示视窗。
     */
    viewer: null,
    
    /**
     * APIProperty: scale
     * {Number} 地图的显示比例尺。
     */
    scale: null,
    
    /**
     * APIProperty: token
     * {String} 安全认证信息。当服务端开启安全认证时，该参数必设。
     */
    token: "",
       /**
     * Constructor: SuperMap.Layer.TiledDynamicRESTLayer
     * 所有SuperMap iServer 6R 分块动态 REST 图层。
     * (start code)    
     * // 向服务端发送请求获取后，获取透明、使用服务端缓存的图层，
     * // 通过options可以设置TiledDynamicRESTLayer的属性及其父类的属性 
     * var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", World_Map,
     *     {transparent: true, cacheEnabled:true}, {maxResolution:"auto"});       
     *     (end) 
     *
     * Parameters:
     * name - {String}  图层标识名称。
     * url - {String} 图层的服务地址。
     * params - {Object} 设置到url上的可选参数。
     * options - {Object} 此类及其父类开放的属性，包括viewBounds、viewer、scale、units、datumAxis五个参数，
     * 获取方式有两种：一是从服务端获取，二是用户自己设置得到，其中，对于units参数，如果用户设置了此参数，
     * 即使已经成功从服务端获取，但是依然会优先使用用户设置的units参数。
     * 当Layer的options设置了units参数，则用Layer的units计算dpi；
     * 如果options没有设置untis，此时会参照Map上的units计算dpi,
     * 此时需要注意的是，如果Layer是在平面坐标系下，Map的options必须设置untis，如果是地理坐标系的情况下可以不设置，
     * 系统默认为“degree”。
     *     
     * Allowed params properties:
     * clipRegion - {<SuperMap.Geometry>} 地图显示裁剪的区域。
     * maxVisibleVertex  - {Number} 几何对象的最大可见节点数。如果几何对象的节点数超过指定的个数，
     *     则该几何对象不显示。默认几何对象的最大可见节点数为36000。 
     * transparent - {Boolean} 图层是否透明，默认为 false，即不透明。
     * cacheEnabled - {Boolean} 是否使用服务端的缓存，默认为 true，即使用服务端的缓存。
     * layersID - {String} 专题图资源 ID 号。
     *     
     * Allowed options properties:
     * viewBounds - {<SuperMap.Bounds>} 在通过Deskpro切图时，获取的图层属性中的当前视图范围。
     * viewer - {<SuperMap.Size>} 用户显示视窗。
     * scale - {Number} 在通过Deskpro切图时，获取的图层属性中的当前比例尺。
     * units - {String} 地图坐标系统的单位。
     * datumAxis - {Number} 椭球体长半轴。
     * format - {String} 栅格图层图片格式。
     */
     
     
    initialize: function (name, url, params, options) {
        var me = this;
        SuperMap.CanvasLayer.prototype.initialize.apply(me, arguments);
        SuperMap.Util.applyDefaults(me.params, me.DEFAULT_PARAMS);
        me.events.addEventType("layerInitialized");
        if (me.params.transparent) {
            if (me.format === "jpg") {
                me.format = SuperMap.Util.alphaHack() ? "gif" : "png";                                          
            }
            if (me.format === "bmp") {
                me.format = SuperMap.Util.alphaHack() ? "bmp" : "png";                                          
            }
        }
        if (typeof me.params.clipRegion !== "undefined") {
            if (me.params.clipRegion instanceof SuperMap.Geometry) {
                me.params.clipRegionEnabled = true;
                var sg = SuperMap.REST.ServerGeometry.fromGeometry(me.params.clipRegion);
                me.params.clipRegion = SuperMap.Util.toJSON(sg);
            } else {
                delete me.params.clipRegion;
            }
        }
        if (typeof me.params.layersID !== "undefined") {
            if (!me.params.layersID){
                delete me.params.layersID;
            }
        }
        
        //用户传Layer的地图单位
        if(me.units){
            me.units = me.units.toLowerCase();
        }
        
        //当在options中设置viewBounds 、viewer 、scale 、units 、datumAxis，则计算dpi
        if (!me.dpi && (!me.viewBounds || !me.viewer || !me.scale)) {
            if (this.bAPP == true) {
                
                 var layerContext = {
                    tile:me
                };
                
                window.plugins.localstoragemanager.getconfig(this.name,
                    function(layerContext){
                        return function(r){
                            layerContext.tile.getAppStatusSucceed(layerContext,r);
                            }
                        }(layerContext),
                    function(e){}
                    );
            } else{
                var getMapStatusService = new SuperMap.REST.GetMapStatusService(me.url,
                        {eventListeners:{processCompleted: me.getStatusSucceed, scope: me, 
                        processFailed: me.getStatusFailed}, projection: me.projection});
                getMapStatusService.processAsync();
            }
        } else if (me.viewBounds && me.viewer && me.scale) {
            me.dpi = SuperMap.Util.calculateDpi(me.viewBounds, me.viewer, me.scale, me.units, me.datumAxis);
        }

        if (me.projection) {        
            var arr = me.projection.getCode().split(":");
            if (arr instanceof Array && arr.length == 2) {
                me.prjStr1 = "{\"epsgCode\":" + arr[1] + "}";
            }
        }
    },
    
    getAppStatusSucceed:function(layerContext,r) {
        var mapStatus = r.json;
        var me = this;
        if (mapStatus != "false")
        {
            mapStatus = eval('(' + mapStatus + ')');
            var bounds = mapStatus.bounds, viewBounds = mapStatus.viewBounds, 
                   coordUnit = mapStatus.coordUnit, 
                   viewer = mapStatus.viewer,
                   scale = mapStatus.scale,
                   datumAxis = mapStatus.datumAxis;
            //将jsonObject转化为SuperMap.Bounds，用于计算dpi。
            viewBounds = new SuperMap.Bounds(viewBounds.left,viewBounds.bottom,viewBounds.right,viewBounds.top);
            me.viewBounds = viewBounds;
            
            viewer = new SuperMap.Size(viewer.rightBottom.x, viewer.rightBottom.y);
            me.viewer = viewer;            
            me.scale = scale;
            
            bounds = new SuperMap.Bounds(bounds.left,bounds.bottom,bounds.right,bounds.top);
            me.maxExtent = bounds;
            
            coordUnit = coordUnit.toLowerCase();
            me.units = me.units || coordUnit;
            me.datumAxis = datumAxis;
            
            me.dpi = SuperMap.Util.calculateDpi(viewBounds, viewer, scale, me.units, datumAxis);
            me.events.triggerEvent('layerInitialized',me);
        }else{
            var getMapStatusService = new SuperMap.REST.GetMapStatusService(me.url,
                        {eventListeners:{processCompleted: me.getStatusSucceed, scope: me, 
                        processFailed: me.getStatusFailed}, projection: me.projection});
                getMapStatusService.processAsync();
        }
    },
    
    /**
     * Method: setMapStatus
     * 计算Dpi，设置maxExtent。
     */
    getStatusSucceed: function(mapStatus) {
        var me = this;
        if (mapStatus.result) {
            var mapStatus = mapStatus.result;
            var bounds = mapStatus.bounds, viewBounds = mapStatus.viewBounds, 
                coordUnit = mapStatus.coordUnit, 
                viewer = mapStatus.viewer,
                scale = mapStatus.scale,
                datumAxis = mapStatus.datumAxis;
            //将jsonObject转化为SuperMap.Bounds，用于计算dpi。
            viewBounds = new SuperMap.Bounds(viewBounds.left,viewBounds.bottom,viewBounds.right,viewBounds.top);
            me.viewBounds = viewBounds;
            
            viewer = new SuperMap.Size(viewer.rightBottom.x, viewer.rightBottom.y);
            me.viewer = viewer;            
            me.scale = scale;
            
            bounds = new SuperMap.Bounds(bounds.left,bounds.bottom,bounds.right,bounds.top);
            me.maxExtent = bounds;
            
            coordUnit = coordUnit.toLowerCase();
            me.units = me.units || coordUnit;
            me.datumAxis = datumAxis;
            
            me.dpi = SuperMap.Util.calculateDpi(viewBounds, viewer, scale, me.units, datumAxis);
            
            if (this.bAPP == true){
                window.plugins.localstoragemanager.savaconfig(this.name,mapStatus);
            }
            
            me.events.triggerEvent('layerInitialized',me);
        }        
    },
    
    /**
     * Method: getStatusFailed
     * 获取图层状态失败
     */
    getStatusFailed: function(failedMessage) {
        //todo
    },
    
    
    /**
     * APIMethod: destroy
     * 解构TiledDynamicRESTLayer类，释放资源。  
     */
    destroy: function () {
        var me = this;
        if(me.getMapStatusService) {
            me.getMapStatusService.events.listeners = null;
            me.getMapStatusService.destroy();
        }
        me.viewBounds = null;
        me.viewer = null;
        me.scale = null;
        
        SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
        me.DEFAULT_PARAMS = null;
    },
    
    /**
     * APIMethod: clone
     * 创建当前图层的副本。
     *
     * Parameters:
     * obj - {Object} 
     *
     * Returns:
     * {<SuperMap.Layer.TiledDynamicRESTLayer>} 
     */
    clone: function (obj) {
        var me = this;
        if (obj == null) {
            obj = new SuperMap.Layer.TiledDynamicRESTLayer(
                me.name, me.url, me.params, me.getOptions());
        }
       
        obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);

        return obj;
    },  
    
    /** 
     * Method: getTileUrl
     * 获取瓦片的URL。
     *
     * Parameters:
     * xyz - {Object} 一组键值对，表示瓦片X, Y, Z方向上的索引。
     *
     * Returns
     * {String} 瓦片的 URL 。
     */
    getTileUrl: function (xyz) {
        var me = this,
            newParams,
            tileSize = me.tileSize,
            scale = me.scales[xyz.z];
        //在没有设置任何投影的情况下，比例尺可能大于1，为了提高容错能力，注释掉比例尺矫正函数。 maoshuyu
        //scale = SuperMap.Util.normalizeScale(scale);
        newParams = {
            "width" : tileSize.w,
            "height" : tileSize.h,
            "x" : xyz.x,
            "y" : xyz.y,
            "scale" : scale,
            //由于服务器关于缓存有问题，所以redirect先设为false。
            "redirect" : false,
            _token : me.token
        };
        if (!me.params.cacheEnabled) {
            newParams.t = new Date().getTime();
        }
        if (typeof me.params.layersID !== "undefined" && typeof newParams.layersID == "undefined") {
            if (me.params.layersID && me.params.layersID.length > 0){
                newParams.layersID = me.params.layersID;
            }
        }
        
        if (me.prjStr1) {
            newParams.prjCoordSys = me.prjStr1;
        }
        
        return me.getFullRequestString(newParams);
    },

    /** 
     * Method: getFullRequestString
     * 将参数与URL合并，获取完整的请求地址。（重写基类方法）
     *
     * Parameters:
     * newParams - {Object}
     * altUrl - {String}
     *   
     * Returns: 
     * {String}
     */
    getFullRequestString:function(newParams, altUrl) {
        var me = this,
            url = altUrl || this.url,
            allParams, paramsString, urlParams;
        allParams = SuperMap.Util.extend({}, me.params),
        allParams = SuperMap.Util.extend(allParams, newParams);
        paramsString = SuperMap.Util.getParameterString(allParams);
        
        if (SuperMap.Util.isArray(url)) {
            url = me.selectUrl(paramsString, url);
        }
        url = url + "/tileImage." + me.format;
        urlParams = SuperMap.Util.upperCaseObject(SuperMap.Util.getParameters(url));
        for (var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = SuperMap.Util.getParameterString(allParams);
        if( me.tileOrigin ){
            paramsString = paramsString + "&origin={\"x\":" + me.tileOrigin.lon + "," + "\"y\":" + me.tileOrigin.lat + "}";
        }
        
        return SuperMap.Util.urlAppend(url, paramsString);
    },
    
    /** 
     * Method: mergeNewParams
     * 动态修改URL的参数。(重写基类方法)
     *
     * Parameters:
     * newParams - {Object}
     *
     * Returns
     * {Boolean} 修改是否成功。
     */
    mergeNewParams: function (newParams) {
        if (typeof (newParams.clipRegion) != "undefined") {
            if (newParams.clipRegion instanceof SuperMap.Geometry) {
                newParams.clipRegionEnabled = true;
                var sg = SuperMap.REST.ServerGeometry.fromGeometry(newParams.clipRegion);
                newParams.clipRegion = SuperMap.Util.toJSON(sg);
            } else {
                delete newParams.clipRegion;
            }
        } 
        return SuperMap.Layer.HTTPRequest.prototype.mergeNewParams.apply(this, [newParams]);
    },

    CLASS_NAME: "SuperMap.Layer.TiledDynamicRESTLayer"
});
