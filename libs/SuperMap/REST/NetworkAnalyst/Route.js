/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/Geometry/LineString.js
 * @requires SuperMap/Geometry/Polygon.js
 * @requires SuperMap/REST/NetworkAnalyst/PointWithMeasure.js
 */

/**
 * Class: SuperMap.REST.Route
 * 路由对象类。
 * 路由对象为一系列有序的带有属性值 M 的 x，y 坐标对，其中 M 值为该结点的距离属性（到已知点的距离）。
 */
SuperMap.REST.Route = SuperMap.Class({
     
    /** 
     * APIProperty: length
     * {Number} 路由对象的长度。
     * 单位与数据集的单位相同。 
     */
    length: null,

    /** 
     * APIProperty: line
     * {<SuperMap.Geometry.LineString>} 路由对应的线几何对象。 
     */
    line: null,

    /** 
     * APIProperty: maxM
     * {Number} 最大线性度量值，即所有结点到起始点的量算距离中最大值。
     */
    maxM: null,

    /** 
     * APIProperty: minM
     * {Number} 最小线性度量值，即所有结点到起始点的量算距离中最大值。
     */
    minM: null,

    /** 
     * APIProperty: points
     * {Array(<SuperMap.REST.PointWithMeasure>)} 具有线性度量值的二维地理坐标点。 
     */
    points: null,

    /** 
     * APIProperty: region
     * {<SuperMap.Geometry.Polygon>} 路由对应的面几何对象。 
     */
    region: null,

    
    /**
     * Constructor: SuperMap.REST.Route
     * 路由对象类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * length - {Number} 路由对象的长度。
     * line - {<SuperMap.Geometry.LineString>} 路由对应的线几何对象。
     * maxM - {Number} 最大线性度量值，即所有结点到起始点的量算距离中最大值。
     * minM - {Number} 最小线性度量值，即所有结点到起始点的量算距离中最大值。
     * points - {Array(<SuperMap.REST.PointWithMeasure>)} 具有线性度量值的二维地理坐标点。
     * region - {<SuperMap.Geometry.Polygon>} 路由对应的面几何对象。 
     */
    initialize: function(options) {
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        var me = this;
        me.length = null;
        me.maxM = null;
        me.minM = null;
        if (me.line) {
            me.line.destroy();
            me.line = null;
        }
        if (me.region) {
            me.region.destroy();
            me.region = null;
        }
        if (me.points) {
            for (var i=0,len=me.points.length; i<len; i++) {
                me.points[i].destroy();
                me.points[i] = null;
            }
            me.points = null
        }
    },
    
    CLASS_NAME: "SuperMap.REST.Route"
});

/**
 * Function: SuperMap.REST.Route.fromJson
 * 将 JSON 对象转换为 Route 对象。 
 *
 * Parameters:
 * jsonObject - {Object} JSON 对象表示的路由对象。 
 *
 * Returns:
 * {<SuperMap.REST.Route>} 转化后的 Route 对象。
 */
SuperMap.REST.Route.fromJson = function(jsonObject) {
    if (!jsonObject) {
        return;
    }
    var result = new SuperMap.REST.Route({
        length: jsonObject.length,
        maxM: jsonObject.maxM,
        minM: jsonObject.minM
    });
    if (jsonObject.line) {
        result.line = SuperMap.REST.ServerGeometry.fromJson(jsonObject.line).toGeometry();
    }
    if (jsonObject.region) {
        result.region = SuperMap.REST.ServerGeometry.fromJson(jsonObject.region).toGeometry();
    }
    if (jsonObject.points) {
        result.points = [];
        for (var i=0,points=jsonObject.points,len=points.length; i<len; i++) {
            result.points[i] = SuperMap.REST.PointWithMeasure.fromJson(points[i]);
        }
    }
    return result;
};