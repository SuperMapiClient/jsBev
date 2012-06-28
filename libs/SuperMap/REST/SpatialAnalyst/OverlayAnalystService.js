﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/REST/FilterParameter.js
 * @requires SuperMap/REST/ServerGeometry.js
 * @requires SuperMap/REST/SpatialAnalyst/DatasetOverlayAnalystResult.js
 * @requires SuperMap/REST/SpatialAnalyst/GeometryOverlayAnalystParameters.js
 * @requires SuperMap/Events.js
 * @requires SuperMap/ServiceBase.js
 * @requires SuperMap/ServiceFailedEventArgs.js
 * @requires SuperMap/ServiceException.js
 */

/**
 * Class: SuperMap.REST.OverlayAnalystService
 * 叠加分析服务类
 * 该类负责将客户设置的叠加分析参数传递给服务端，并接收服务端返回的叠加分析结果数据。
 * 叠加分析结果通过该类支持的事件的监听函数参数获取，参数类型为 {<SuperMap.REST.OverlayAnalystEventArgs>}; 获取的结果数据包括 originResult 、result 两种，
 * 其中，originResult 为服务端返回的用 JSON 对象表示的量算结果数据，result 为服务端返回的量算结果数据，result 属性的类型与传入的参数类型相关，
 * 当缓冲区分析服务的参数为 {<SuperMap.REST.DatasetOverlayAnalystParameters>} 时，返回的结果类型为 {<SuperMap.REST.DatasetOverlayAnalystResult>} ;
 * 当参数为 {<SuperMap.REST.GeometryOverlayAnalystParameters>} 类型时，返回的结果类型为 {<SuperMap.REST.GeometryOverlayAnalystResult>} 。
 * 
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
SuperMap.REST.OverlayAnalystService = SuperMap.Class(SuperMap.ServiceBase, {

    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型。
     * - *processCompleted* 服务端返回叠加分析结果触发该事件。 
     * - *processFailed* 服务端返回叠加分析结果失败触发该事件。       
     */
    EVENT_TYPES: ["processCompleted", "processFailed"],

    /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 OverlayAnalystService 类中处理所有事件的对象，支持 processCompleted 、processFailed 两种事件，服务端成功返回叠加分析结果时触发 processCompleted 事件，服务端返回叠加分析结果失败时触发 processFailed 事件。 
     *
     * 例如:
     * (start code)     
     * var myOverlayAnalystService = new SuperMap.REST.OverlayAnalystService(url);
     * myOverlayAnalystService.events.on({
     *     "processCompleted": overlayCompleted, 
     *	   "processFailed": overlayFailed
     *	   }
     * );
     * function overlayCompleted(args){//todo};
     * function overlayFailed(args){//todo};
     * (end)     
     */
    events: null,

    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选），对 OverlayAnalystService 支持的两个事件 processCompleted 、processFailed 进行监听，相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,

    /** 
     * Property: lastResult
     * {<SuperMap.REST.DatasetOverlayAnalystResult>}/{<SuperMap.REST.GeometryOverlayAnalystResult>} 服务端返回的叠加分析结果数据。 
     * 该属性的类型与传入的参数类型相关，当缓冲区分析服务的参数为 
     * {<SuperMap.REST.DatasetOverlayAnalystParameters>} 时，
     * 返回的结果类型为 {<SuperMap.REST.DatasetOverlayAnalystResult>} ;
     * 当参数为 {<SuperMap.REST.GeometryOverlayAnalystParameters>} 类型时，
     * 返回的结果类型为 {<SuperMap.REST.GeometryOverlayAnalystResult>} 。  
     */
    lastResult: null,

    /**
     * Property: mode
     * {<String>} 叠加分析类型
     */
    mode: null,
    
    /**
     * Constructor: SuperMap.REST.OverlayAnalystService
     * 查询叠加分析服务基类构造函数。
     *     
     * 例如：
     * (start code)     
     * var myOverlayAnalystService = new SuperMap.REST.OverlayAnalystService(url, {
     *     eventListeners: {
     *	       "processCompleted": OverlayCompleted, 
     *		   "processFailed": OverlayFailed
     *		   }
     * }); 
     * (end)     
     *
     * Parameters:
     * url - {String} 服务的访问地址。如http://localhost:8090/iserver/services/spatialanalyst-changchun/restjsr/spatialanalyst 。
     * options - {Object} 参数。     
     * 
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function (url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, [url]);
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
     * 释放资源,将引用资源的属性置空。
     */
    destroy: function () {
        SuperMap.ServiceBase.prototype.destroy.apply(this, arguments);
        var me = this;
        me.EVENT_TYPES = null;
        if (me.events) {
            me.events.destroy();
            me.events = null;
        }
        if (me.eventListeners) {
            me.eventListeners = null;
        }
        if (me.lastResult) {
            me.lastResult.destroy();
            me.lastResult = null;
        }
        me.mode = null;
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.OverlayAnalystParameters>} 
    */
    processAsync: function (parameter) {
        var parameterObject = new Object();
        var me = this;

        var end = me.url.substr(me.url.length - 1, 1);
        if (end == '/') {

        } else {
            me.url += "/";
        }

        if (parameter instanceof SuperMap.REST.DatasetOverlayAnalystParameters) {
            me.mode = "datasets";
            me.url += 'datasets/' + parameter.sourceDataset + '/overlay';
            SuperMap.REST.DatasetOverlayAnalystParameters.toObject(parameter, parameterObject);
        }
        else if (parameter instanceof SuperMap.REST.GeometryOverlayAnalystParameters) {
            me.mode = "geometry";
            me.url += 'geometry/overlay';
            SuperMap.REST.GeometryOverlayAnalystParameters.toObject(parameter, parameterObject);
        }

        var jsonParameters = SuperMap.Util.toJSON(parameterObject);

        if (me.isInTheSameDomain) {
            me.url += '.json?returnContent=true';
        } else {
            me.url += '.jsonp?returnContent=true';
        }

        me.request({
            method: "POST",
            data: jsonParameters,
            scope: me,
            success: me.analyzeComplete,
            failure: me.analyzeError
        });
    },

    /**
     * Method: analyzeComplete
     * 叠加分析成功完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的缓冲区叠加分析结果对象。
     */
    analyzeComplete: function (result) {
        result = SuperMap.Util.transformResult(result);
        if (this.mode == "datasets") {
            var analyzeResult = SuperMap.REST.DatasetOverlayAnalystResult.fromJson(result);
        }
        else if (this.mode == "geometry") {
            var analyzeResult = SuperMap.REST.GeometryOverlayAnalystResult.fromJson(result);
        }
        this.mode = null;
        this.lastResult = analyzeResult;

        var se = new SuperMap.REST.OverlayAnalystEventArgs(analyzeResult, result);
        this.events.triggerEvent("processCompleted", se);
    },

    /**
     * Method: analyzeError
     * 叠加分析失败，执行此方法。
     *
     * Parameters:
     * result -  {Object} 服务器返回的结果对象。
     */
    analyzeError: function (result) {
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

    CLASS_NAME: "SuperMap.REST.OverlayAnalystService"
});