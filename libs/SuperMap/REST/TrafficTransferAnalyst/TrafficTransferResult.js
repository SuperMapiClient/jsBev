/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/ResourceInfo.js
 */

/**
 * Class: SuperMap.REST.TrafficTransferResult
 * 公交换乘结果类。
 */
SuperMap.REST.TrafficTransferResult = SuperMap.Class({
    /** 
     * Property: transferGuides
     * {Array(Object)} 公交换乘导引对象，记录了从换乘分析起始站点到终止站点的公交换乘导引方案，通过
     * 此对象可以获取公交换乘导引对象中子项的个数，根据序号获取公交换乘导引的子项对象，导引总距离以及总花费等。	 
     */
    transferGuides: null,
    
    /**
     * Constructor: SuperMap.REST.TrafficTransferResult
     * 公交换乘结果类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * transferGuides - {Array(Integer)} 公交换乘导引对象，记录了从换乘分析起始站点到终止站点的公交换乘导引方案。 
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
        if (me.transferGuides) {
            me.transferGuides.length = 0;
            me.transferGuides = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.TrafficTransferResult"
});

/**
 * Function: SuperMap.REST.TrafficTransferResult.fromJson
 * 将要素集更新时表示的返回结果转化为 TrafficTransferResult 对象。 
 *
 * Parameters:
 * jsonObject - {Object} 新创建要素的返回结果。 
 *
 * Returns:
 * {<SuperMap.REST.TrafficTransferResult>} 转化后的 TrafficTransferResult 对象。
 */
SuperMap.REST.TrafficTransferResult.fromJson = function(jsonObject) {
    if (!jsonObject) {
        return;
    }
    if(jsonObject instanceof Array) {
        return new SuperMap.REST.TrafficTransferResult({
            transferGuides: jsonObject
        });
    } 
};