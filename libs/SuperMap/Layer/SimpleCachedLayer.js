/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/CanvasLayer.js
 */

/**
 * Class: SuperMap.Layer.SimpleCachedLayer
 * 用于对接SuperMap iServer Java 6R的缓存图层(Version 3.1)。
 *
 * Inherits from:
 * - <SuperMap.CanvasLayer>
 */

SuperMap.Layer.SimpleCachedLayer = SuperMap.Class(SuperMap.CanvasLayer, {

    /**
     * APIProperty: urlTemplate
     * {String} URL模板。
     */
    urlTemplate: "${layerName}_${w}x${h}/${scale}/${x}/${y}.${format}",

    /**
     * APIProperty: layerName
     * {String} 地图名称。
     */
    layerName: null,
        
    /**
     * Constructor: SuperMap.Layer.SimpleCachedLayer
     * 分块缓存图层。
	 * 
     *
     * Parameters:
     * name - {String}  图层标识名称。
     * url - {String} 图层的服务地址。
     * layerName - {String} 地图名称。
     * options - {Object}  附加到图层属性上的可选项。dpi 和 resolutions或scales属性必设。
     */
    initialize: function (name, url, layerName, options) {
        var me = this;
        me.layerName = layerName;
        SuperMap.CanvasLayer.prototype.initialize.apply(me, [name, url, {}, options]);
    },
    
    /**
     * APIMethod: clone
     * 创建当前图层的副本。
     *
     * Parameters:
     * obj - {Object} 
     *
     * Returns:
     * {<SuperMap.Layer.SimpleCachedLayer>} 
     */
    clone: function (obj) {
        var me = this;
        if (obj == null) {
            obj = new SuperMap.Layer.SimpleCachedLayer(
                me.name, me.url, me.layerName, me.getOptions());
        }
       
        obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);

        return obj;
    }, 

    /**
     * APIMethod: destroy
     * 解构TiledCachedLayer类，释放资源。  
     */
    destroy: function () {
        var me = this;
        SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
        me.layerName = null;
        me.urlTemplate = null;
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
            tileSize = me.tileSize,
            scale = me.scales[xyz.z],
            url = me.url,
            urlTemplate = me.urlTemplate,
            layerName = me.layerName,
            format = me.format;
        //在没有设置任何投影的情况下，比例尺可能大于1，为了提高容错能力，注释掉比例尺矫正函数。 maoshuyu
        //scale = SuperMap.Util.normalizeScale(scale);
        if (SuperMap.Util.isArray(url)) {
            var s = "" + xyz.x + xyz.y + xyz.z + tileSize.h + tileSize.w + layerName + format;
            url = me.selectUrl(s, url);
        }
        url = (url.charAt(url.length - 1) == "/") ? url + urlTemplate : url + "/" + urlTemplate;
        return SuperMap.String.format(url, {
            x: xyz.x,
            y: xyz.y,
            scale: Math.round(1/scale),
            h: tileSize.h,
            w: tileSize.w,
            layerName: layerName,
            format: format
        });
    },
    
    CLASS_NAME: "SuperMap.Layer.SimpleCachedLayer"
});
