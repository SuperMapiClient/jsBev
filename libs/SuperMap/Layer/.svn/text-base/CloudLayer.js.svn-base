/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/BaseTypes/Bounds.js
 * @requires SuperMap/CanvasLayer.js
 */

/**
 * Class: SuperMap.Layer.CloudLayer
 * 云服务图层类。
 *     通过向SuperMap 云服务器发送请求得到 SuperMap 云服务发布的图层。
 *
 * Inherits from:
 *  - <SuperMap.CanvasLayer>
 */

SuperMap.Layer.CloudLayer = SuperMap.Class(SuperMap.CanvasLayer, {

    /**
     * APIProperty: name
     * {String} 图层标识名称，默认为：CloudLayer。
     */
    name: "CloudLayer",
    
    /**
     * APIProperty: url
     * {String} 地图资源地址。默认为：http://t0.supermapcloud.com/FileService/image
     */
    url: 'http://t0.supermapcloud.com/FileService/image',
    
    /**
     * APIProperty: mapName
     * {String} 地图名称。默认为 quanguo
     */
    mapName: "quanguo",
        
    /**
     * Property: type
     * {String} 地图投影。
     */
    type: "web",

    /**
     * Constructor: SuperMap.Layer.CloudLayer
     * 云服务图层类。
     *
     * Parameters:
     * options - {Object}  附加到图层属性上的可选项。
     */
    initialize: function (options) {
        var me = this;
        me.url = me.url + '?map=${mapName}&type=${type}&x=${x}&y=${y}&z=${z}';
        options = SuperMap.Util.extend({
            maxExtent: new SuperMap.Bounds(
                -2.0037508342789244E7,
                -2.003750834278914E7,
                2.0037508342789244E7,
                2.00375083427891E7
            ),
            resolutions: [156605.46875, 78302.734375, 39151.3671875, 19575.68359375, 9787.841796875, 4893.9208984375, 2446.96044921875, 1223.48022460937, 611.740112304687, 305.870056152344, 152.935028076172, 76.4675140380859, 38.233757019043, 19.1168785095215, 9.55843925476074, 4.77921962738037, 2.38960981369019, 1.19480490684509, 0.597402453422546]
        }, options);
        SuperMap.CanvasLayer.prototype.initialize.apply(me, [me.name, me.url, null, options]);
    },
    
    /**
     * APIMethod: destroy
     * 解构CloudLayer类，释放资源。  
     */
    destroy: function () {
        var me = this;
        SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
        me.mapName = null;
        me.name = null;
        me.url = null;
    },

    /**
     * APIMethod: clone
     * 创建当前图层的副本。
     *
     * Parameters:
     * obj - {Object} 
     *
     * Returns:
     * {<SuperMap.Layer.CloudLayer>} 
     */
    clone: function (obj) {
        var me = this;
        if (obj == null) {
            obj = new SuperMap.Layer.CloudLayer(
                me.name, me.url, me.layerName, me.getOptions());
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
     * {String} 瓦片的 URL。
     */
    getTileUrl: function (xyz) {
        var me = this,
            url = me.url;
        return SuperMap.String.format(url, {
            mapName: me.mapName,
            type: me.type,
            x: xyz.x,
            y: xyz.y,
            z: xyz.z
        });
    },

    CLASS_NAME: "SuperMap.Layer.CloudLayer"
});
