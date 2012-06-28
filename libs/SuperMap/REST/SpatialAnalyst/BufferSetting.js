/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/REST/SpatialAnalyst/BufferDistance.js
 */

/**
 * Class: SuperMap.REST.BufferSetting
 * 缓冲区分析通用设置类
 */
SuperMap.REST.BufferSetting = SuperMap.Class({

    /** 
     * APIProperty: endType
     * {<SuperMap.REST.BufferEndType>} 缓冲区端点枚举值。
     * 分为平头和圆头两种，默认为平头，即 SuperMap.REST.BufferEndType.FLAT 。
     */
    endType: SuperMap.REST.BufferEndType.FLAT,

    /**
     * APIProperty: leftDistance
     * {<SuperMap.REST.BufferDistance>} 左侧缓冲距离。
     * 默认为100地图单位。 
     */
    leftDistance: null,

    /**
     * APIProperty: rightDistance
     * {<SuperMap.REST.BufferDistance>} 右侧缓冲距离。
     * 默认为100地图单位。 
     */
    rightDistance: null,

    /** 
     * APIProperty: semicircleLineSegment
     * {Number} 圆头缓冲圆弧处线段的个数。
     * 即用多少个线段来模拟一个半圆，默认值为4。
     */
    semicircleLineSegment: 4,

    /**
     * Constructor: SuperMap.REST.BufferSetting 
     * 缓冲区分析通用设置类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * endType - {<SuperMap.REST.BufferEndType>} 缓冲区端点枚举值。
     * leftDistance - {<SuperMap.REST.BufferDistance>} 左侧缓冲距离。
     * rightDistance - {<SuperMap.REST.BufferDistance>} 右侧缓冲距离。
     * semicircleLineSegment - {Number} 圆头缓冲圆弧处线段的个数。
     */
    initialize: function (options) {
        var me = this;
        me.leftDistance = new SuperMap.REST.BufferDistance();
        me.rightDistance = new SuperMap.REST.BufferDistance();
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。 
     */
    destroy: function () {
        var me = this;
        me.endType = null;
        if (me.leftDistance) {
            me.leftDistance.destroy();
            me.leftDistance = null;
        }
        if (me.rightDistance) {
            me.rightDistance.destroy();
            me.rightDistance = null;
        }
        me.semicircleLineSegment = null;
    },

    CLASS_NAME: "SuperMap.REST.BufferSetting"
});