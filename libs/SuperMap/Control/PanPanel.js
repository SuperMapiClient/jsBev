/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control/Panel.js
 * @requires SuperMap/Control/Pan.js
 */

/**
 * Class: SuperMap.Control.PanPanel
 * 该类实现地图的四个方向的平移操作。默认显示在地图的左上角。
 *
 * 说明: 
 * 若在IE6下显示正常，需要添加如下代码：
 * 
 * (code)
 * <!--[if lte IE 6]>
 *   <link rel="stylesheet" href="../resource/theme/default/ie6-style.css" type="text/css" />
 * <![endif]-->
 * (end)
 *
 * Inherits from:
 *  - <SuperMap.Control.Panel> 
 */
SuperMap.Control.PanPanel = SuperMap.Class(SuperMap.Control.Panel, {

    /** 
     * APIProperty: slideFactor
     * {Integer} 该控件表示每个方向平移一次的像素数量，默认为50像素。可以用<slideRatio>实现平移一次地图移动的比例。
     */
    slideFactor: 50,

    /** 
     * APIProperty: slideRatio
     * {Number} 该控件每一个方向平移一次地图的移动比例。默认为null，如果设置该属性，会覆盖slideFactor属性值。
     * 例如：该属性值为0.5，移动距离为地图高度的一半。
     */
    slideRatio: null,

    /**
     * Constructor: SuperMap.Control.PanPanel 
     * 创建该类的新实例。
     *
     * Parameters:
     * options - {Object} 设置该类及其父类开放的属性值。
     */
    initialize: function(options) {
        SuperMap.Control.Panel.prototype.initialize.apply(this, [options]);
        var options = {
            slideFactor: this.slideFactor,
            slideRatio: this.slideRatio
        };
        this.addControls([
            new SuperMap.Control.Pan(SuperMap.Control.Pan.NORTH, options),
            new SuperMap.Control.Pan(SuperMap.Control.Pan.SOUTH, options),
            new SuperMap.Control.Pan(SuperMap.Control.Pan.EAST, options),
            new SuperMap.Control.Pan(SuperMap.Control.Pan.WEST, options)
        ]);
    },

    CLASS_NAME: "SuperMap.Control.PanPanel"
});
