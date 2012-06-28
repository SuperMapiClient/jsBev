﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/ServiceEventArgs.js
 * @requires SuperMap/REST/NetworkAnalyst/FindTSPPathsResult.js
 */

/**
 * Class: SuperMap.REST.FindTSPPathsEventArgs
 * 旅行商分析服务事件数据类。
 * 该类包含了从服务端传回的旅行商分析结果数据。
 *
 * Inherits from:
 *  - <SuperMap.ServiceEventArgs> 
 */
SuperMap.REST.FindTSPPathsEventArgs = SuperMap.Class(SuperMap.ServiceEventArgs,{
    /** 
     * APIProperty: result
     * {<SuperMap.REST.FindTSPPathsResult>} 服务端返回的旅行商分析结果数据。    
     * FindTSPPathsResult 类，结果中包含了旅行商路径的弧段、结点信息，路由对象，行驶导引等。  
     */
    result: null,
    
    /**
     * Constructor: SuperMap.REST.FindTSPPathsEventArgs
     * 最佳路径分析服务事件数据类构造函数。
     *
     * Parameters:
     * result - {<SuperMap.REST.FindTSPPathsResult>} 服务端返回的旅行商分析结果数据。
     * originResult - {Object} 服务端返回的存储了最旅行商分析结果数据的 JSON 字符串。 
     */
    initialize: function(result,originResult) {
        SuperMap.ServiceEventArgs.prototype.initialize.apply(this, [originResult]);
        var me = this;
        me.result = result;
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        SuperMap.ServiceEventArgs.prototype.destroy.apply(this);
        var me = this;
        if (me.result) {
            me.result.destroy();
            me.result = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.FindTSPPathsEventArgs"
});