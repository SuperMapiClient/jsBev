/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 */

/**
 * Class: SuperMap.REST.PointWithMeasure
 * 路由点类。
 * 路由点是指具有线性度量值(Measure)的二维地理坐标点。
 */
SuperMap.REST.PointWithMeasure = SuperMap.Class({
    
    /** 
     * APIProperty: x
     * {Number} 获取当前点对象在地理坐标系下的 X 坐标值。
     */
    x: null,
    
    /** 
     * APIProperty: y
     * {Number} 获取当前点对象在地理坐标系下的 Y 坐标值。
     */
    y: null,
    
    /** 
     * APIProperty: measure
     * {Number} 度量值，即路由对象属性值 M。
     */
    measure: null,
    
    /**
     * Constructor: SuperMap.REST.PointWithMeasure
     * 路由点类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * measure - {Number} 度量值，即路由对象属性值 M。
     * x - {Number} 获取当前点对象在地理坐标系下的 X 坐标值。
     * y - {Number} 获取当前点对象在地理坐标系下的 Y 坐标值。
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
        me.measure = null;
        me.x = null;
        me.y = null;
    },
    
    CLASS_NAME: "SuperMap.REST.PointWithMeasure"
});

/**
 * Function: SuperMap.REST.PointWithMeasure.fromJson
 * 将 JSON 对象转换为 PointWithMeasure 对象。 
 *
 * Parameters:
 * jsonObject - {Object} JSON 对象表示的路由点。 
 *
 * Returns:
 * {<SuperMap.REST.PointWithMeasure>} 转化后的 PointWithMeasure 对象。
 */
SuperMap.REST.PointWithMeasure.fromJson = function(jsonObject) {
    if (!jsonObject) {
        return;
    }
    return new SuperMap.REST.PointWithMeasure({
        x: jsonObject.x,
        y: jsonObject.y,
        measure: jsonObject.measure
    });
};