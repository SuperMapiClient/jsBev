/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/JoinItem.js
 * @requires SuperMap/REST/Theme/Theme.js
 */

/**
 * Class: SuperMap.REST.ThemeParameters
 * 专题图参数类
 * 该类存储了制作专题所需的参数，包括数据源、数据集名称和专题图对象。 
 */
SuperMap.REST.ThemeParameters = SuperMap.Class({

    /** 
     * APIProperty: datasetNames
     * {Array(String)} 要制作专题图的数据集数组，必设。  
     */
    datasetNames: null,
    
    /** 
     * APIProperty: dataSourceNames
     * {Array(String)} 要制作专题图的数据集所在的数据源数组，必设。 
     */
    dataSourceNames: null,
    
    /** 
     * APIProperty: joinItems
     * {Array(<SuperMap.REST.JoinItem>)} 设置与外部表的连接信息 JoinItem 数组。
     * 使用此属性可以制作与外部表连接的专题图。 
     */
    joinItems: null,
    
    /** 
     * APIProperty: themes
     * {Array(<SuperMap.REST.Theme>)} 专题图对象列表。
     * 该参数为实例化的各类专题图对象的集合。
     */
    themes: null,
    
    /**
     * Constructor: SuperMap.REST.ThemeParameters
     * 专题图参数类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * datasetNames - {Array(String)} 要制作专题图的数据集数组。  
     * dataSourceNames - {Array(String)} 要制作专题图的数据集所在的数据源数组。
     * joinItems - {Array(<SuperMap.REST.JoinItem>)} 专题图外部表的连接信息 JoinItem 数组。
     * themes - {Array(<SuperMap.REST.Theme>)} 专题图对象列表。
     */
    initialize: function(options) {
        if (options){
            SuperMap.Util.extend(this, options);
        }
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。 
     */
    destroy: function() { 
        var me = this;
        me.datasetNames = null;
        me.dataSourceNames = null;
        if (me.joinItems) {
            for (var i=0, joinItems=me.joinItems, len=joinItems.length; i<len; i++) {
                joinItems[i].destroy();
            }
            me.joinItems = null;
        }
        if (me.themes) {
            for (var i=0, themes=me.themes, len=themes.length; i<len; i++) {
                themes[i].destroy();
            }
            me.themes = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.ThemeParameters"
});