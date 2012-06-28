﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/GetFeaturesServiceBase.js
 * @requires SuperMap/REST/GetFeaturesBySQLParameters.js
 */

/**
 * Class: SuperMap.REST.GetFeaturesBySQLService
 * 数据服务中数据集 SQL 查询服务类。
 * 在一个或多个指定的图层上查询符合 SQL 条件的空间地物信息。
 * 
 * Inherits from:
 *  - <SuperMap.REST.GetFeaturesServiceBase> 
 */
SuperMap.REST.GetFeaturesBySQLService = SuperMap.Class(SuperMap.REST.GetFeaturesServiceBase, {

    /**
     * Constructor: SuperMap.REST.GetFeaturesBySQLService
     * SQL 查询服务类构造函数。
     *
     * 例如：
     * (start code)     
     * var myGetFeaturesBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
     *     eventListeners: {
     *         "processCompleted": GetFeaturesCompleted, 
     *         "processFailed": GetFeaturesError
     *         }
     * });
     * function getFeaturesCompleted(QueryEventArgs){//todo};
     * function getFeaturesError(QueryEventArgs){//todo};
     * (end)
     *
     * Parameters:
     * url - {String} 服务的访问地址。如访问World服务，只需将url设为: http://localhost:8090/iserver/services/data-world/rest/data 即可。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function(url, options) {
        SuperMap.REST.GetFeaturesServiceBase.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        SuperMap.REST.GetFeaturesServiceBase.prototype.destroy.apply(this, arguments); 
    },
    
    /**
     * Method: getJsonParameters
     * 将查询参数转化为 JSON 字符串。
     * 在本类中重写此方法，可以实现不同种类的查询（ID, SQL, Buffer, Geometry等）。
     *
     * Parameters:
     * params - {<SuperMap.REST.GetFeaturesBySQLParameters>} 
     *
     * Returns:
     * {Object} 转化后的 JSON 字符串。
     */
    getJsonParameters: function(params) {
        return  SuperMap.REST.GetFeaturesBySQLParameters.toJsonParameters(params);
    },
    
    CLASS_NAME: "SuperMap.REST.GetFeaturesBySQLService"
});