﻿/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*//** * @requires SuperMap/Util.js * @requires SuperMap/REST/NetworkAnalyst/TransportationAnalystResultSetting.js *//** * Class: SuperMap.REST.TransportationAnalystParameter * 交通网络分析通用参数类。 * 该类主要用来提供交通网络分析所需的通用参数。 * 通过本类可以设置障碍边、障碍点、权值字段信息的名称标识、转向权值字段等信息，还可以对分析结果包含的内容进行一些设置。  */SuperMap.REST.TransportationAnalystParameter = SuperMap.Class({    /**      * APIProperty: barrierEdgeIDs     * {Array(<Number>)} 网络分析中障碍弧段的 ID 数组。弧段设置为障碍边之后，表示双向都不通。       */    barrierEdgeIDs: null,        /**      * APIProperty: barrierNodeIDs     * {Array(<Number>)} 网络分析中障碍点的 ID 数组。结点设置为障碍点之后，表示任何方向都不能通过此结点。      */     barrierNodeIDs: null,        /**      * APIProperty: weightFieldName     * {String} 阻力字段的名称，标识了进行网络分析时所使用的阻力字段，例如表示时间、长度等的字段都可以用作阻力字段。     * 该字段默值为服务器发布的所有耗费字段的第一个字段。可以通过 GetEdgeWeightNamesService 类获取服务端发布的所有耗费字段。      */     weightFieldName: null,    /**      * APIProperty: turnWeightField     * {String} 转向权重字段的名称。可以通过 GetTurnNodeWeightNamesService 类获取服务端发布的所有转向权重字段。      */     turnWeightField: null,    /**      * APIProperty: resultSetting     * {<SuperMap.REST.TransportationAnalystResultSetting>} 分析结果返回内容。      */     resultSetting: null,     /**     * Constructor: SuperMap.REST.FindPathParameters     * 交通网络分析通用参数类构造函数。     *     * Parameters:     * options - {Object} 参数。     *     * Allowed options properties:     * barrierEdgeIDs - {Array(<Number>)} 网络分析中障碍弧段的 ID 数组。       * barrierNodeIDs - {Array(<Number>)} 网络分析中障碍点的 ID 数组。     * weightFieldName - {String} 阻力字段的名称。     * turnWeightField - {String} 转向权重字段的名称。     * resultSetting - {<SuperMap.REST.TransportationAnalystResultSetting>} 分析结果返回内容。     */    initialize: function(options) {        var me = this;        me.resultSetting = new SuperMap.REST.TransportationAnalystResultSetting();        if (!options) {            return;        }        SuperMap.Util.extend(this, options);    },        /**     * APIMethod: destroy     * 释放资源，将引用资源的属性置空。       */    destroy: function() {         var me = this;        me.barrierEdgeIDs = null;        me.barrierNodeIDs = null;        me.weightFieldName = null;        me.turnWeightField = null;        if (me.resultSetting) {            me.resultSetting.destroy();            me.resultSetting = null;        }    },        CLASS_NAME: "SuperMap.REST.TransportationAnalystParameter"}); 