﻿/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Symbolizer.js
 */

/**
 * Class: SuperMap.Symbolizer.Text
 * 文本标签的渲染样式。
 */
SuperMap.Symbolizer.Text = SuperMap.Class(SuperMap.Symbolizer, {
    
    /** 
     * APIProperty: label
     * {String} 标签的文本信息。
     * 
     * 此处没有默认设置。默认使用 SuperMap.Renderer.defaultRenderer。
     */
    
    /** 
     * APIProperty: fontFamily
     * {String} 标签的字体类型。
     * 
     * 此处没有默认设置。默认使用 SuperMap.Renderer.defaultRenderer。
     */

    /** 
     * APIProperty: fontSize
     * {String} 标签的字体大小。
     * 
     * 此处没有默认设置。默认使用 SuperMap.Renderer.defaultRenderer。
     */

    /** 
     * APIProperty: fontWeight
     * {String} 标签的字体粗细.
     * 
     * 此处没有默认设置。默认使用 SuperMap.Renderer.defaultRenderer。
     */
    
    /**
     * Property: fontStyle
     * {String} 标签的字体样式。
     * 
     * 此处没有默认设置。 默认使用 SuperMap.Renderer.defaultRenderer。
     */

    /**
     * Constructor: SuperMap.Symbolizer.Text
     * 构造函数。创建一个用于文本标签的渲染样式。
     *
     * Parameters:
     * config - {Object}属性设置对象，其属性会被设置到当前Text样式对象上。样式的任何内部属性都可以通过构造函数来设置。
     *
     * Returns:
     * 新创建的文本渲染样式。
     */
    initialize: function(config) {
        SuperMap.Symbolizer.prototype.initialize.apply(this, arguments);
    },
    
    CLASS_NAME: "SuperMap.Symbolizer.Text"
    
});

