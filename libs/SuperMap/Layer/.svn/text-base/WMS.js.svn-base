/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */


/**
 * @requires SuperMap/Layer/Grid.js
 * @requires SuperMap/Tile/Image.js
 */

/**
 * Class: SuperMap.Layer.WMS
 * 该类用来访问OGC地图服务网站的数据。
 * 
 * Inherits from:
 *  - <SuperMap.Layer.Grid>
 */
SuperMap.Layer.WMS = SuperMap.Class(SuperMap.Layer.Grid, {

    /**
     * Constant: DEFAULT_PARAMS
     * {Object} 该类的默认值。
     */
    DEFAULT_PARAMS: { service: "WMS",
                      version: "1.1.1",
                      request: "GetMap",
                      styles: "",
                      format: "image/png"
                     },
    
    /**
     * Property: reproject
     * *Deprecated*. See http://trac.SuperMap.org/wiki/SphericalMercator
     * for information on the replacement for this functionality. 
     * {Boolean} Try to reproject this layer if its coordinate reference system
     *           is different than that of the base layer.  Default is false.  
     *           Set this in the layer options.  Should be set to false in 
     *           most cases.
     */
    reproject: false,
 
    /**
     * APIProperty: isBaseLayer
     * {Boolean} 判断是否是底层，默认为true。
     */
    isBaseLayer: true,
    
    /**
     * APIProperty: encodeBBOX
     * {Boolean} BBOX中的 “逗号”是否会被编码。默认为false。
     * 某些服务实现的WMS需要编码。
     */
    encodeBBOX: false,
    
    /** 
     * APIProperty: noMagic 
     * {Boolean} 如果设置为true，用TRANSPARENT=TRUE时图片格式不能自由转换
     *     image/jpeg 为 image/png 或者 image/gif 格式，而且不能用构造函数改变 isBaseLayer 属性。默认为false。
     */ 
    noMagic: false,
    
    /**
     * Property: yx
     * {Object} Keys in this object are EPSG codes for which the axis order
     *     is to be reversed (yx instead of xy, LatLon instead of LonLat), with
     *     true as value. This is only relevant for WMS versions >= 1.3.0.
     */
    yx: {'EPSG:4326': true},
    
    /**
     * Constructor: SuperMap.Layer.WMS
     * 构造函数，实例化一个WMS图层。
     *
     * 例如:
     *
     * 创建image/png格式的WMS图层
     * (code)
     * var wms = new SuperMap.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {layers: "modis,global_mosaic"});
     * (end)
     *
     * 通过附加选项创建透明的WMS图层
     * (code)
     * var wms = new SuperMap.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {
     *                                        layers: "modis,global_mosaic",
     *                                        transparent: true
     *                                    }, {
     *                                        opacity: 0.5,
     *                                        singleTile: true
     *                                    });
     * (end)
     *
     * Parameters:
     * name - {String} 图层名字
     * url - {String} 图层的url路径
     *                (e.g. http://wms.jpl.nasa.gov/wms.cgi)
     * params - {Object} 拥有键值对的对象。获取地图时必须的查询字符串参数和参数值。
     * options - {Object} 在该类及其父类总开放的属性。
     */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        //uppercase params
        params = SuperMap.Util.upperCaseObject(params);
        if (parseFloat(params.VERSION) >= 1.3 && !params.EXCEPTIONS) {
            params.EXCEPTIONS = "INIMAGE";
        } 
        newArguments.push(name, url, params, options);
        SuperMap.Layer.Grid.prototype.initialize.apply(this, newArguments);
        SuperMap.Util.applyDefaults(
                       this.params, 
                       SuperMap.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );


        //layer is transparent        
        if (!this.noMagic && this.params.TRANSPARENT && 
            this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            
            // unless explicitly set in options, make layer an overlay
            if ( (options == null) || (!options.isBaseLayer) ) {
                this.isBaseLayer = false;
            } 
            
            // jpegs can never be transparent, so intelligently switch the 
            //  format, depending on the browser's capabilities
            if (this.params.FORMAT == "image/jpeg") {
                this.params.FORMAT = SuperMap.Util.alphaHack() ? "image/gif"
                                                                 : "image/png";
            }
        }

    },    

    /**
     * Method: destroy
     * Destroy this layer
     */
    destroy: function() {
        // for now, nothing special to do here. 
        SuperMap.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<SuperMap.Layer.WMS>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new SuperMap.Layer.WMS(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
        }

        //get all additions from superclasses
        obj = SuperMap.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * APIMethod: reverseAxisOrder
     * 在WMS标准大于等于1.3版本且投影为EPSG:4326时，坐标轴会被反转
     * yx会变成xy，LatLon会变成LonLat。
     * Returns:
     * {Boolean} 如果AxisOrder被倒转，则返回true，否则为false.
     */
    reverseAxisOrder: function() {
        return (parseFloat(this.params.VERSION) >= 1.3 && 
            !!this.yx[this.map.getProjectionObject().getCode()]);
    },
    
    /**
     * Method: getURL
     * Return a GetMap query string for this layer
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>} A bounds representing the bbox for the
     *                                request.
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters.
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        
        var imageSize = this.getImageSize();
        var newParams = {};
        // WMS 1.3 introduced axis order
        var reverseAxisOrder = this.reverseAxisOrder();
        newParams.BBOX = this.encodeBBOX ?
            bounds.toBBOX(null, reverseAxisOrder) :
            bounds.toArray(reverseAxisOrder);
        newParams.WIDTH = imageSize.w;
        newParams.HEIGHT = imageSize.h;
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },

    /**
     * APIMethod: mergeNewParams
     * 为 params 附加新值。该类重写父类的 mergeNewParams 方法。
     * 一旦参数改变，瓦片会使用这些新的参数加载图片。
     * 
     * Parameters:
     * newParams - {Object} 新参数
     */
    mergeNewParams:function(newParams) {
        var upperParams = SuperMap.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        return SuperMap.Layer.Grid.prototype.mergeNewParams.apply(this, 
                                                             newArguments);
    },

    /** 
     * APIMethod: getFullRequestString
     * 用图层的参数和附加的新参数组合url。
     *
     * Parameters:
     * newParams - {Object} 新的参数对象
     * altUrl - {String} 使用当前的url而代替图层的url。
     * 
     * Returns:
     * {String} 
     */
    getFullRequestString:function(newParams, altUrl) {
        var mapProjection = this.map.getProjectionObject();
        var projectionCode = this.projection && this.projection.equals(mapProjection) ?
            this.projection.getCode() :
            mapProjection.getCode();
        var value = (projectionCode == "none") ? null : projectionCode;
        if (parseFloat(this.params.VERSION) >= 1.3) {
            this.params.CRS = value;
        } else {
            this.params.SRS = value;
        }
        
        if (typeof this.params.TRANSPARENT == "boolean") {
            newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
        }

        return SuperMap.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },

    CLASS_NAME: "SuperMap.Layer.WMS"
});
