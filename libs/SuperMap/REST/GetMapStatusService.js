﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * Class: SuperMap.REST.GetMapStatusService
 * 地图信息服务类 。
 * 该类负责将从客户端指定的服务器上获取该服务器提供的地图信息,结果保存在 {<SuperMap.REST.GetMapStatusResult>} 对象中,结果包含了所请求的地图的显示比例尺、地图的全幅地理范围、地图窗口显示区域的范围和用户显示视窗。
 * 地图信息结果通过该类支持的事件的监听函数参数获取，参数类型为 {<SuperMap.REST.GetMapStatusEventArgs>}; 获取的结果数据包括 result 、originResult 两种，
 * 其中，originResult 为服务端返回的用 JSON 对象表示的地图信息结果数据，result 为服务端返回的地图信息结果数据，保存在 {<SuperMap.REST.GetMapStatusResult>} 对象中。 
 * 
 * Inherits from:
 *  - <SuperMap.ServiceBase> 
 */
 SuperMap.REST.GetMapStatusService = SuperMap.Class(SuperMap.ServiceBase, {
     
    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型
     * - *processCompleted* 服务端返回地图信息成功触发该事件 。     
     * - *processFailed* 服务端返回地图信息失败触发该事件 。
     */
    EVENT_TYPES: ["processCompleted", "processFailed"],
 
     /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 GetMapStatusService 类中处理所有事件的对象，支持 processCompleted 、processFailed 两种事件，服务端成功返回地图信息结果时触发 processCompleted 事件，服务端返回地图信息结果时触发 processFailed 事件。     
     *
     * 例如：
     * (start code)
     * var myGetMapStatusService = new SuperMap.REST.GetMapStatusService(url);
     * myGetMapStatusService.events.on({
     *     "processCompleted": getMapStatusCompleted, 
     *     "processFailed": getMapStatusFailed
     *	   }
     * );
     * function getMapStatusCompleted(GetMapStatusEventArgs){//todo};
     * function getMapStatusFailed(GetMapStatusEventArgs){//todo};
     * (end)
     */
    events: null,
    
    /**
     * APIProperty: eventListeners
     * {Object} 听器对象，在构造函数中设置此参数（可选），对 GetMapStatusService 支持的两个事件 processCompleted 、processFailed 进行监听，
     * 相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,
    
    /**
     * APIProperty: projection
     * {<SuperMap.Projection>} or {<String>} 
     * 根据投影参数获取地图状态信息。
     */
    projection: null,
    
    /** 
     * Property: lastResult
     * {<SuperMap.REST.GetMapStatusResult>} 服务端返回的地图信息结果数据 。 
     */
    lastResult: null,
    
    /**
     * Constructor: SuperMap.REST.GetMapStatusService
     * 地图信息服务类构造函数 。
     *
     * 例如：
     * (start code)	 
     * var myGetMapStatusService = new SuperMap.REST.GetMapStatusService(url, {
     * eventListeners:{
     *     "processCompleted": GetMapStatusCompleted, 
     *	   "processFailed": getMapStatusFailed
     *	   }
     * });
     * (end)	 
     *
     * Parameters:
     * url - {String} 服务的访问地址。如：http://localhost:8090/iserver/services/map-world/rest/maps/World+Map 。
     * options - {Object} 参数 。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function(url,options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, arguments);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
        var me = this;
        me.events = new SuperMap.Events(
            me, null, me.EVENT_TYPES, true
        );
        
        me.eventListeners && me.events.on(me.eventListeners);
        me.url += me.isInTheSameDomain ? ".json" : ".jsonp";    
        
        if (me.projection) {
            if(typeof me.projection == "string") {
                me.projection = new SuperMap.Projection(me.projection);
            }
            
            var arr = me.projection.getCode().split(":");
            if (arr instanceof Array && arr.length == 2) {
                me.url += "?prjCoordSys={\"epsgCode\":" + arr[1] + "}";
            }
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用的资源属性置空。  
     */
    destroy: function() {
        SuperMap.ServiceBase.prototype.destroy.apply(this, arguments); 
        var me = this;
        me.EVENT_TYPES = null;
        if(me.events){
            me.events.un(me.eventListeners);
            me.events.listeners = null;
            me.events.destroy();
            me.events = null;
            me.eventListeners = null;
        }

        if(me.lastResult){
            me.lastResult.destroy();
            me.lastResult = null;
        }
    },
    
    /**
     * APIMethod: processAsync
     * 负责将客户端的设置的参数传递到服务端，与服务端完成异步通讯。 
     *
     */
    processAsync: function() {
        var me = this;
        me.request({
            method: "GET",
            scope: me,
            success: me.getMapStatusCompleted,
            failure: me.getMapStatusError
        });
    },
    
    /**
     * Method: getMapStatusCompleted
     * 获取地图状态完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    getMapStatusCompleted: function(result) {
        var me = this,
            ge = null
        result = SuperMap.Util.transformResult(result);
        var getMapStatusResult = SuperMap.REST.GetMapStatusResult.fromJson(result);
        me.lastResult = getMapStatusResult;
        ge = new SuperMap.REST.GetMapStatusEventArgs(getMapStatusResult, result);
        me.events && me.events.triggerEvent("processCompleted",ge);
    },
    
    /**
     * Method: getMapStatusError
     * 获取地图状态失败，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    getMapStatusError: function(result) {
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
        qe = new SuperMap.ServiceFailedEventArgs(serviceException,result);
        me.events.triggerEvent("processFailed",qe);
    },
    
    CLASS_NAME: "SuperMap.REST.GetMapStatusService"
 });
