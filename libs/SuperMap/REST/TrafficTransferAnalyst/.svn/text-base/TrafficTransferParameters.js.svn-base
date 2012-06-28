/* Copyright (c) 2000-2011 by SuperMap Software Co., Ltd.*/

/**
 *@requires SuperMap/REST.js
 */

/**
 * Class: SuperMap.REST.TrafficTransferParameters
 * 公交换乘参数类。 
 */
SuperMap.REST.TrafficTransferParameters = SuperMap.Class({
    /** 
     * APIProperty: trafficNetData
     * {String} 交通换成网络数据集。必设。
     */
    trafficNetData: null,
    
    /** 
     * APIProperty: maxTransferGuideCount
     * {Integer} 最大换乘导引数量，默认值为 50。
	 * 是指期望返回的换乘路线总数的最大值，如果为5，则表示返回不超过5种换乘方案。
     */
    maxTransferGuideCount: null,
    
    /** 
     * APIProperty: transferTactic
     * {<SuperMap.REST.TransferTactic>} 公交换乘策略类型，包括时间最短、距离最短、最少换乘、最少步行四种选择。
     */
    transferTactic: SuperMap.REST.TransferTactic.LESS_TIME,
    
    /** 
     * APIProperty: walkingRatio
     * {Number} 步行与公交的消耗权重比，默认值为 10。此值越大，则步行因素对于方案选择的影响越大。例如：
	 * 例如现在有两种换乘方案（在仅考虑消耗因素的情况下）： 
	 * 方案1：坐车10公里，走路1公里； 
	 * 方案2：坐车15公里，走路0.5公里； 
	 * 1. 假设权重比为15： 
	 * •方案1的总消耗为：10 + 1*15 = 25
	 * •方案2的总消耗为：15 + 0.5*15 = 22.5
	 * 此时方案2消耗更低。 
	 * 2. 假设权重比为2： 
	 * •方案1的总消耗为：10+1*2 = 12
	 * •方案2的总消耗为：15+0.5*2 = 17
	 * 此时方案1消耗更低。 
     */
    walkingRatio: null,
    
    /** 
     * APIProperty: points
     * {Array(String) or Array(Object)} 两种查询方式： 
     *           1. 按照公交站点的起止ID进行查询，则points参数的类型为int[]，形如：[起点ID、终点ID]，
     * 公交站点的ID对应服务提供者配置中的stopIDField；
     *           2. 按照起止点的坐标进行查询，则points参数的类型为Point2D[]，形如：[{"x":44,"y":39},{"x":45,"y":40}]。
     */
    points: false,
    
    /**
     * Constructor: SuperMap.REST.TrafficTransferParameters
     * 公交换乘参数类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * trafficNetData - {Array(Object)} 当前需要创建或者是修改的要素集。  
     * maxTransferGuideCount - {Boolean} 最大换乘导引数量，默认值为 50。
     * transferTactic - {<SuperMap.REST.EditType>} 公交换乘策略类型，
     * 包括时间最短、距离最短、最少换乘、最少步行四种选择。
     * walkingRatio - {Array(Integer)} 步行与公交的消耗权重比，默认值为 10。
     * points - {Array(Integer)} 两种查询方式：按照公交站点的起止ID进行查询和按照起止点的坐标进行查询。	 
     */
    initialize: function(options) {
        if (!options) {
            return;
        }
        SuperMap.Util.extend(this, options);
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。
     */
    destroy:function () {
        var me = this;
        me.trafficNetData = null;
        me.maxTransferGuideCount = null;
        me.transferTactic = null;
        me.walkingRatio = null;
        me.points = null;
    },
    
    CLASS_NAME:"SuperMap.REST.TrafficTransferParameters"
});
/**
 * Function: SuperMap.REST.TrafficTransferParameters.toJsonParameters
 * 将 <SuperMap.REST.TrafficTransferParameters> 对象参数转换为 json 字符串。 
 *
 * Parameters:
 * params - {<SuperMap.REST.TrafficTransferParameters>} 公交换乘参数。 
 *
 * Returns:
 * {String} 转化后的 json字符串。
 */
SuperMap.REST.TrafficTransferParameters.toJsonParameters = function(params) {
    if(params) {
        return SuperMap.Util.toJSON(params);
    }
};