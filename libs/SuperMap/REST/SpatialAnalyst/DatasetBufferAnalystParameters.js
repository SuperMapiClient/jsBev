﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/REST/SpatialAnalyst/BufferSetting.js
 * @requires SuperMap/REST/FilterParameter.js
 * @requires SuperMap/REST/SurfaceAnalyst/DataReturnOption.js
 * @requires SuperMap/REST/SpatialAnalyst/BufferAnalystParameters.js
 */

/**
 * Class: SuperMap.REST.DatasetBufferAnalystParameters
 * 数据集缓冲区分析参数类
 *
 * Inherits from:
 *  - <SuperMap.REST.BufferAnalystParameters> 
 */
SuperMap.REST.DatasetBufferAnalystParameters = SuperMap.Class(SuperMap.REST.BufferAnalystParameters, {
    
    /** 
     * APIProperty: dataset
     * {String} 要用来做缓冲区分析的数据源中数据集的名称。该名称用形如"数据集名称@数据源别名"形式来表示。
     */
    dataset: null,
    
    /** 
     * APIProperty: filterQueryParameter
     * {<SuperMap.REST.FilterParameter>} 设置数据集中几何对象的过滤条件。只有满足此条件的几何对象才参与缓冲区分析。
     */
    filterQueryParameter: null,
        
    /** 
     * APIProperty: resultSetting
     * {<SuperMap.REST.DataReturnOption>} 结果返回设置类。
     */    
    resultSetting: null,
    
    /** 
     * APIProperty: isAttributeRetained
     * {Boolean} 是否保留进行缓冲区分析的对象的字段属性，默认为 true。当 isUnion 字段为 false 时该字段有效。 
     */
    isAttributeRetained: true,

    /** 
     * APIProperty: isUnion
     * {Boolean} 是否将缓冲区与源记录集中的对象合并后返回。对于面对象而言，要求源数据集中的面对象不相交。默认为 false。
     */
    isUnion: false,

    /**
     * Constructor: SuperMap.REST.DatasetBufferAnalystParameters 
     * 数据集缓冲区分析参数类构造函数。
     * 
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * dataset - {String} 要用来做缓冲区分析的数据源中数据集的名称。该名称用形如"数据集名称@数据源别名"形式来表示。
     * filterQueryParameter - {<SuperMap.REST.FilterParameter>} 设置数据集中几何对象的过滤条件。只有满足此条件的几何对象才参与缓冲区分析。
     * resultSetting - {<SuperMap.REST.DataReturnOption>} 结果返回设置类。
     * isAttributeRetained - {Boolean} 是否保留进行缓冲区分析的对象的字段属性，默认为 true。当 isUnion 字段为 false 时该字段有效。 
     * isUnion - {Boolean} 是否将缓冲区与源记录集中的对象合并后返回。对于面对象而言，要求源数据集中的面对象不相交。默认为 false。 
     * bufferSetting - {<SuperMap.REST.BufferSetting>} 设置缓冲区通用参数。
     */
    initialize: function (options) {
        var me = this;
        me.filterQueryParameter = new SuperMap.REST.FilterParameter();
        me.resultSetting = new SuperMap.REST.DataReturnOption();
        SuperMap.REST.BufferAnalystParameters.prototype.initialize.apply(this, arguments);
        if (!options) {
            return;
        }
        SuperMap.Util.extend(this, options);
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function () {
        SuperMap.REST.BufferAnalystParameters.prototype.destroy.apply(this,arguments);

        var me = this;
        me.dataset = null;
        if (me.filterQueryParameter) {
            me.filterQueryParameter.destroy();
            me.filterQueryParameter = null;
        }
        if (me.resultSetting) {
            me.resultSetting.destroy();
            me.resultSetting = null;
        }
        me.isAttributeRetained = null;
        me.isUnion = null;
    },

    CLASS_NAME: "SuperMap.REST.DatasetBufferAnalystParameters"
});

SuperMap.REST.DatasetBufferAnalystParameters.toObject =  function(datasetBufferAnalystParameters, tempObj){
    for (var name in datasetBufferAnalystParameters) {
        if (name == "bufferSetting") {
            tempObj.bufferAnalystParameter = datasetBufferAnalystParameters.bufferSetting;
        }
        else if (name == "resultSetting") {
            tempObj.dataReturnOption = datasetBufferAnalystParameters.resultSetting;
        }
        else if (name == "dataset") {
        }
        else {
            tempObj[name] = datasetBufferAnalystParameters[name];
        }
    }
};