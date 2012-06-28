/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/ResourceInfo.js
 */

/**
 * Class: SuperMap.REST.ThemeResult
 * 专题图结果类。
 * 专题图结果类中包含了专题图结果资源（ResourceInfo)的相关信息。
 */
SuperMap.REST.ThemeResult = SuperMap.Class({
    
    /** 
     * APIProperty: resourceInfo
     * {<SuperMap.REST.ResourceInfo>} 专题图结果资源。 
     */
    resourceInfo: null,
    
    /**
     * Constructor: SuperMap.REST.ThemeResult
     * 专题图结果类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * resourceInfo - {<SuperMap.REST.ResourceInfo>} 专题图结果资源。 
     */
    initialize: function(options) {
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。
     */
    destroy: function() {
        var me = this;
        if (me.resourceInfo) {
            me.resourceInfo.destroy();
            me.resourceInfo = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.ThemeResult"
});