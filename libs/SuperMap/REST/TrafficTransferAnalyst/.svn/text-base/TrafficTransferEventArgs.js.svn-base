/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/ServiceEventArgs.js
 * @requires SuperMap/REST/EditFeaturesResult.js
 */

/**
 * Class: SuperMap.REST.TrafficTransferEventArgs
 * 公交换乘事件类。
 * 该类包含了从服务端传回的公交换乘结果数据。
 *
 * Inherits from:
 *  - <SuperMap.ServiceEventArgs> 
 */
SuperMap.REST.TrafficTransferEventArgs = SuperMap.Class(SuperMap.ServiceEventArgs, {
    
    /** 
     * APIProperty: result
     * {<SuperMap.REST.TrafficTransferResult>} 服务端返回的公交换乘结果数据。
     */
    result: null,
    
    /**
     * Constructor: SuperMap.REST.TrafficTransferEventArgs
     * 公交换乘事件类构造函数。
     *
     * Parameters:
     * result - {<SuperMap.REST.TrafficTransferResult>} 服务端返回的公交换乘结果数据。
     * originResult - {Object} 服务端返回的用 JSON 对象表示的公交换乘结果数据。
     */
    initialize: function(result, originResult) {
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
    
    CLASS_NAME: "SuperMap.REST.TrafficTransferEventArgs"
});