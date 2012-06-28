﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/ServiceBase.js
 * @requires SuperMap/ServiceFailedEventArgs.js
 * @requires SuperMap/REST/FindMTSPPathsParameters.js
 * @requires SuperMap/REST/FindMTSPPathResult.js
 * @requires SuperMap/REST/FindMTSPPathsEventArgs.js
 */

/**
 * Class: SuperMap.REST.FindMTSPPathsService
 * 多旅行商分析服务类
 * 多旅行商分析也称为物流配送，是指在网络数据集中，给定 M 个配送中心点和 N 个配送目的地（M，N 为大于零的整数）。
 * 查找经济有效的配送路径，并给出相应的行走路线。
 * 物流配送功能就是解决如何合理分配配送次序和送货路线，使配送总花费达到最小或每个配送中心的花费达到最小。
 * 该类负责将客户端指定的多旅行商分析参数传递给服务端，并接收服务端返回的结果数据。
 * 多旅行商分析结果通过该类支持的事件的监听函数参数获取，参数类型为 {<SuperMap.REST.FindMTSPPathsEventArgs>}; 获取的结果数据包括 originResult 、result 两种，
 * 其中，originResult 为服务端返回的用 JSON 对象表示的多旅行商分析结果数据，result 为服务端返回的多旅行商分析结果数据，保存在 {<SuperMap.REST.FindMTSPPathsResult>} 对象中。
 * 
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
SuperMap.REST.FindMTSPPathsService = SuperMap.Class(SuperMap.ServiceBase, {
    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型。
     * - *processCompleted* 服务端返回多旅行商分析结果触发该事件。 
     * - *processFailed* 服务端返回多旅行商分析结果失败触发该事件。       
     */
    EVENT_TYPES: [
        "processCompleted", "processFailed"],

    /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 FindMTSPPathsService 类中处理所有事件的对象，支持 processCompleted 、processFailed 两种事件，服务端成功返回多旅行商分析结果时触发 processCompleted 事件，服务端返回多旅行商分析结果失败时触发 processFailed 事件。
     *
     * 例如：
     * (start code)     
     * var myFindMTSPPathsService = new SuperMap.REST.FindMTSPPathsService(url);
     * myFindMTSPPathsService.events.on({
     *     "processCompleted": findMTSPPathsCompleted, 
     *	   "processFailed": findMTSPPathsError
     *	   }
     * );
     * function findMTSPPathsCompleted(findLocationEventArgs){//todo};
     * function findMTSPPathsError(findLocationEventArgs){//todo};
     * (end)     
     */ 

    events: null,

    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选），对 FindMTSPPathsService 支持的两个事件 processCompleted 、processFailed 进行监听，相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,

    /** 
     * Property: lastResult
     * {<SuperMap.REST.FindMTSPPathsResult>} 获取服务端返回的多旅行分析结果数据。 
     */
    lastResult: null,

    /**
     * Constructor: SuperMap.REST.FindMTSPPathsService
     * 最佳路径分析服务类构造函数。
     *
     * 例如：
     * (start code)
     * var myFindMTSPPathsService = new SuperMap.REST.FindMTSPPathsService(url, {
     *     eventListeners: {
     *         "processCompleted": findMTSPPathsCompleted, 
     *		   "processFailed": findMTSPPathsError
     *		   }
     * });
     * (end)       
     *
     * Parameters:
     * url - {String} 服务的访问地址。如: http://localhost:8090/iserver/services/transportationanalyst-sample/rest/networkanalyst/RoadNet@Changchun 。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function (url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, arguments);
        var me = this;
        if (options) {
            SuperMap.Util.extend(me, options);
        }
        me.events = new SuperMap.Events(
            me, null, me.EVENT_TYPES, true
        );
        if (me.eventListeners instanceof Object) {
            me.events.on(me.eventListeners);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function () {
        SuperMap.ServiceBase.prototype.destroy.apply(this, arguments);
        var me = this;
        me.EVENT_TYPES = null;
        me.events = null;
        me.eventListeners = null;
        if (me.lastResult) {
            me.lastResult.destroy();
            me.lastResult = null;
        }
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.FindMTSPPathsParameters>} 
     */
    processAsync: function (params) {
        if (!params) {
            return;
        }
        var me = this, jsonObject,
            end = me.url.substr(me.url.length - 1, 1),
            centers = me.getJson(params.isAnalyzeById, params.centers);
            nodes = me.getJson(params.isAnalyzeById, params.nodes);
        me.url = me.url + "/mtsppath" + (this.isInTheSameDomain ? ".json?" : ".jsonp?");       
        jsonObject = {
            centers: centers,
            nodes: nodes,
            parameter: SuperMap.Util.toJSON(params.parameter),
            hasLeastTotalCost: params.hasLeastTotalCost
        }
        me.request({
            method: "GET",
            params: jsonObject,
            scope: me,
            success: me.findMTSPPathsComplete,
            failure: me.findMTSPPathsError
        });
    },

    /**
     * Method: getJson
     * 将对象转化为JSON字符串。
     *
     * Parameters:
     * isAnalyzeById - {Boolean}
     * params - {Array} 
     *
     * Returns:
     * {Object} 转化后的JSON字符串。
     */
    getJson: function (isAnalyzeById, params) {
        var jsonString = "[",
            len = params ? params.length : 0;
        
        if (isAnalyzeById === false) {
            for (var i = 0; i < len; i++) {
                if (i > 0) jsonString += ",";
                jsonString += '{"x":' + params[i].x + ',"y":' + params[i].y + '}';
            }            
        } else if (isAnalyzeById == true) {
            for (var i = 0; i < len; i++) {
                if (i > 0) jsonString += ",";
                jsonString += params[i];
            }
        }        
        jsonString += ']';
        return jsonString;
    },

    /**
     * Method: findMTSPPathsComplete
     * 多旅行商分析完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    findMTSPPathsComplete: function (result) {
        var me = this,
            findMTSPPathsResult, fe;
        result = SuperMap.Util.transformResult(result);
        findMTSPPathsResult = SuperMap.REST.FindMTSPPathsResult.fromJson(result);
        me.lastResult = findMTSPPathsResult;
        fe = new SuperMap.REST.FindMTSPPathsEventArgs(findMTSPPathsResult, result);
        me.events.triggerEvent("processCompleted", fe);
    },

    /**
     * Method: findMTSPPathsError
     * 多旅行商分析失败，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    findMTSPPathsError: function (result) {
        var me = this,
            error = null,
            serviceException = null,
            se = null;
        result = SuperMap.Util.transformResult(result);
        error = result.error;
        if (!error) {
            return;
        }
        serviceException = SuperMap.ServiceException.fromJson(error);
        se = new SuperMap.ServiceFailedEventArgs(serviceException, result);
        me.events.triggerEvent("processFailed", se);
    },

    CLASS_NAME: "SuperMap.REST.FindMTSPPathsService"
});