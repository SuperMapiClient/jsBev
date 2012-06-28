/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Events.js
 * @requires SuperMap/ServiceBase.js
 * @requires SuperMap/ServiceFailedEventArgs.js
 * @requires SuperMap/ServiceException.js
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/TrafficTransferResult.js
 * @requires SuperMap/REST/TrafficTransferParameters.js
 * @requires SuperMap/REST/TrafficTransferEventArgs.js
 * @requires SuperMap/REST/ResourceInfo.js
 */

/**
 * Class: SuperMap.REST.TrafficTransferService
 * 公交换乘服务类。
 * 返回结果通过该类支持的事件的监听函数参数获取，参数类型为 {<SuperMap.REST.TrafficTransferEventArgs>}; 获取的结果数据包括 result 、originResult 两种，
 * 其中，originResult 为服务端返回的用 JSON 对象表示的结果数据，result 为服务端返回的结果数据，保存在 {<SuperMap.REST.TrafficTransferResult>} 对象中 。
 * 
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
SuperMap.REST.TrafficTransferService = SuperMap.Class(SuperMap.ServiceBase, {
    
    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     *      
     * 此类支持的事件类型:
     * - *processCompleted* 服务端返回查询结果触发该事件。 
     * - *processFailed* 服务端返回查询结果失败触发该事件。       
     */
    EVENT_TYPES: ["processCompleted", "processFailed"],
    
    /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 TrafficTransferService 类中处理所有事件的对象，支持两种事件 processCompleted 、processFailed ，服务端成功返回查询结果时触发 processCompleted 事件，服务端返回查询结果失败时触发 processFailed 事件。
     * 
     * 例如：
     *     (start code) 
     * var myService = new SuperMap.REST.TrafficTransferService(url); 
     * myService.events.on({
     *     "processCompleted": TrafficTransferCompleted, 
     *       "processFailed": TrafficTransferError
     *       }
     * );
     * function TrafficTransferCompleted(TrafficTransferEventArgs){//todo};
     * function TrafficTransferError(TrafficTransferEventArgs){//todo};
     * (end)     
     */   
    events: null,
    
    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选），对 TrafficTransferService 支持的两个事件 processCompleted 、processFailed 进行监听，相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,
    
    /** 
     * Property: lastResult
     * {<SuperMap.REST.TrafficTransferResult>} 服务端返回的结果数据。 
     */
    lastResult: null,
    
    /**
     * Constructor: SuperMap.REST.TrafficTransferService
     * 公交换乘服务类构造函数。     
     * 
     * 例如：
     * (start code)     
     * var myService = new SuperMap.REST.TrafficTransferService(url, {eventListeners: {
     *     "processCompleted": TrafficTransferCompleted, 
     *     "processFailed": TrafficTransferError
     *     }
     * };
     * (end)
     *
     * Parameters:
     * url - {String} 服务的访问地址。如访问World Map服务，只需将url设为: http://localhost:8090/iserver/services/data-world/rest/data 即可。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function(url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, [url]);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
        var me = this;
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
    destroy: function() {
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
    },
    
    /**
     * APIMethod: processAsync
     * 负责将客户端的更新参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.TrafficTransferParameters>} 公交换乘参数。
     */
    processAsync: function(params) {
        if(!params){
            return;
        }
        var me = this,
            method = "GET",
            jsonParameters = null;
            
        end = me.url.substr(me.url.length - 1, 1);
        me.url += (end === "/") ? params.trafficNetData : ("/" + params.trafficNetData);
        me.url += me.isInTheSameDomain ? "/path.json" : "path.jsonp";
        
        jsonParameters =  SuperMap.REST.EditFeaturesParameters.toJsonParameters(params);   
        
        me.request({
            method: method,
            data: jsonParameters,
            scope: me,
            success: me.editFeaturesComplted,
            failure: me.editFeaturesFailed
        });
    },

    /**
     * Method: editFeaturesComplted
     * 编辑完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    editFeaturesComplted: function(result) {
        var me = this,
            qe = null,
            editFeatureResult = null;
        
        result = SuperMap.Util.transformResult(result);
        editFeatureResult = SuperMap.REST.EditFeaturesResult.fromJson(result);      
        me.lastResult = editFeatureResult;
        qe = new SuperMap.REST.EditFeaturesEventArgs(editFeatureResult, result);
        me.events.triggerEvent("processCompleted", qe);
    },
    
    /**
     * Method: editFeaturesFailed
     * 编辑失败，执行此方法。
     *
     * Parameters:
     * result -  {Object} 服务器返回的结果对象。
     */
    editFeaturesFailed: function(result) {
        var me = this,
            error = null,
            serviceException = null,
            qe = null;
        result = SuperMap.Util.transformResult(result);
        error = result.error;
        if (!error) {
            return;
        }
        serviceException = SuperMap.ServiceException.fromJson(error);        
        qe = new SuperMap.ServiceFailedEventArgs(serviceException, result);
        me.events.triggerEvent("processFailed", qe);
    },
    
    CLASS_NAME: "SuperMap.REST.TrafficTransferService"
});