/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/Recordset.js
 * @requires SuperMap/REST/ResourceInfo.js
 */

/**
 * Class: SuperMap.REST.GetFeaturesResult
 * 数据集查询结果类。
 * 数据集查询结果类中包含了查询结果数据集（SuperMap.REST.Recordset）或查询结果资源（ResourceInfo)的相关信息。
 */
SuperMap.REST.GetFeaturesResult = SuperMap.Class({
    
    /** 
     * APIProperty: featureCount
     * {Integer} 符合查询条件的记录的数量。 
     */
    featureCount: null,

    /** 
     * APIProperty: featureUriList
     * {Array} 查询结果要素作为资源在服务器上的地址列表。
     */    
    featureUriList: null,
    
    /** 
     * APIProperty: recordsets
     * {Array(<SuperMap.REST.Recordset>)} 数据集查询结果记录集数组。
     * 将查询出来的地物按照图层进行划分，
     * 一个查询记录集存放一个图层的查询结果，即查询出的所有地物要素。 
     */
    recordsets: null,
    
    /** 
     * APIProperty: resourceInfo
     * {<SuperMap.REST.ResourceInfo>} 查询结果资源。 
     */
    resourceInfo: null,
    
    /**
     * Constructor: SuperMap.REST.GetFeaturesResult
     * 数据集查询结果类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * featureCount - {Integer} 符合查询条件的记录的总数。
     * featureUriList - {Array} 查询结果要素作为资源在服务器上的地址列表。 
     * recordsets - {Array(<SuperMap.REST.Recordset>)} 查询结果数据集。
     * resourceInfo - {<SuperMap.REST.ResourceInfo>} 查询结果资源。 
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
        me.featureCount = null;
        if (me.featureUriList) {
            me.featureUriList.length = 0;
            me.featureUriList = null;
        }
         if (me.recordsets) {
            for (var i=0,recordsets=me.recordsets,len=recordsets.length; i<len; i++) {
                recordsets[i].destroy();
            }
            me.recordsets = null;
        }
        if (me.resourceInfo) {
            me.resourceInfo.destroy();
            me.resourceInfo = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.GetFeaturesResult"
});

/**
 * Function: SuperMap.REST.GetFeaturesResult.fromJson
 * 将 JSON 对象表示的查询结果转化为 GetFeaturesResult 对象。 
 *
 * Parameters:
 * jsonObject - {Object} JSON 对象表示的查询结果。 
 *
 * Returns:
 * {<SuperMap.REST.GetFeaturesResult>} 转化后的 GetFeaturesResult 对象。
 */
SuperMap.REST.GetFeaturesResult.fromJson = function(jsonObject) {
    if (!jsonObject) {
        return;
    }
    return new SuperMap.REST.GetFeaturesResult({
        featureCount: jsonObject.featureCount,
        featureUriList: jsonObject.featureUriList,
        recordsets: [SuperMap.REST.Recordset.fromJson(jsonObject)],
        resourceInfo: jsonObject.resourceInfo
    });
};