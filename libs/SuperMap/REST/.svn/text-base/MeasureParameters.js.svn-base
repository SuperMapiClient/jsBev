/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 */

/**
 * Class: SuperMap.REST.MeasureParameters
 * 量算参数类。
 * 客户端要量算的地物间的距离或某个区域的面积是一个 {<SuperMap.Geometry>}  类型的几何对象（{<SuperMap.Geometry.LineString>} 或 {<SuperMap.Geometry.Polygon>}），
 * 它将与指定的量算单位一起作为量算参数传到服务端。最终服务端将以指定单位返回得到的距离或面积。 
 */
SuperMap.REST.MeasureParameters = SuperMap.Class({

    /** 
     * APIProperty: geometry
     * {<SuperMap.Geometry>} 要量算的几何对象（{<SuperMap.Geometry.LineString>} 或 {<SuperMap.Geometry.Polygon>}），必设属性。
     */
    geometry: null,
    
    /** 
     * APIProperty: unit
     * {<SuperMap.REST.Unit>}  量算单位。默认单位：米，即量算结果以米为单位。
     */
    unit: SuperMap.REST.Unit.METER,
    
    /**
     * Constructor: SuperMap.REST.MeasureParameters
     * 量算参数类构造函数。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 要量算的几何对象。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * unit - {<SuperMap.REST.Unit>} 量算单位。  
     */
    initialize: function(geometry, options) {
        if (!geometry) {
            return;
        }
        this.geometry = geometry;
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
        me.geometry = null;
        me.unit = null;
    },
    
    CLASS_NAME: "SuperMap.REST.MeasureParameters"
});