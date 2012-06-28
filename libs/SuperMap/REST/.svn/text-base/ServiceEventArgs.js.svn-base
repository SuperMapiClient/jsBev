/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/


/**
 * Class: SuperMap.ServiceEventArgs
 * 服务事件结果相关参数的基类。
 */
SuperMap.ServiceEventArgs = SuperMap.Class({
    
    /** 
     * APIProperty: originResult
     * {Object} 服务端返回的用 JSON 对象表示的结果数据。 
     */
    originResult: null,
    
    /**
     * Constructor: SuperMap.ServiceEventArgs
     * 服务事件结果相关参数的基类构造函数。
     *
     * Parameters:
     * originResult - {Object} 服务端返回的用 JSON 对象表示的结果数据。 
     */
    initialize: function(originResult) {
        this.originResult = originResult;
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        this.originResult = null;
    },
    
    CLASS_NAME: "SuperMap.ServiceEventArgs"
});