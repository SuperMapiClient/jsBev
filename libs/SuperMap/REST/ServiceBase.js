/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Ajax.js
 * @requires SuperMap/Util.js
 */

/**
 * Class: SuperMap.ServiceBase
 * 服务基类。
 * 抽象类，查询、量算等服务类均继承该类。
 */
SuperMap.ServiceBase = SuperMap.Class({

    /**
     * APIProperty: url
     * {String} 服务访问地址。 
     */
    url: null,
    
    /** 
     * Property: isInTheSameDomain
     * {Boolean}  
     */
    isInTheSameDomain: null,
    
    /**
     * Constructor: SuperMap.ServiceBase
     * 服务基类构造函数。
     *
     * Parameters:
     * url - {String} 服务访问地址。
     */
    initialize: function(url) {
        if(!url){
            return false;
        }
        var me = this;
        me.url = url;
        me.isInTheSameDomain = SuperMap.Util.isInTheSameDomain (me.url);
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function () {
        var me = this;
        me.url = null;
        me.isInTheSameDomain = null;
    },
    
    /**
     * APIMethod: request
     * 该方法用于向服务发送请求。 
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * method - {String} 请求方式，包括GET，POST，PUT， DELETE。
     * url - {String}  发送请求的地址。
     * params - {Object} 作为查询字符串添加到url中的一组键值对，
     *     此参数只适用于GET方式发送的请求。
     * data - {String } 发送到服务器的数据。
     * success - {Function} 请求成功后的回调函数。
     * failure - {Function} 请求失败后的回调函数。
     * scope - {Object} 如果回调函数是对象的一个公共方法，设定该对象的范围。
     * isInTheSameDomain - {Boolean} 请求是否在当前域中。
     */
    request: function(options) {
        var me = this;
        options.url = options.url || me.url;
        options.isInTheSameDomain = me.isInTheSameDomain;
        SuperMap.Util.committer(options);
    },

    CLASS_NAME: "SuperMap.ServiceBase"
});