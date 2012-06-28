/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control/Panel.js
 * @requires SuperMap/Control/ZoomIn.js
 * @requires SuperMap/Control/ZoomOut.js
 * @requires SuperMap/Control/ZoomToMaxExtent.js
 */

/**
 * Class: SuperMap.Control.ZoomPanel
 * 该控件由三部分组成：{<SuperMap.Control.ZoomIn>}, {<SuperMap.Control.ZoomToMaxExtent>},
 * {<SuperMap.Control.ZoomOut>}，默认位置在地图的左上角。
 *
 * 说明: 
 * 若使用默认的图片，并且在IE6下也有不错的效果，需要做如下设置：
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
SuperMap.Control.ZoomPanel = SuperMap.Class(SuperMap.Control.Panel, {

    /**
     * Constructor: SuperMap.Control.ZoomPanel 
     * 创建该类的新实例。
     *
     * Parameters:
     * options - {Object} 设置该类和其父类开放的属性值。
     */
    initialize: function(options) {
        SuperMap.Control.Panel.prototype.initialize.apply(this, [options]);
        this.addControls([
            new SuperMap.Control.ZoomIn(),
            new SuperMap.Control.ZoomToMaxExtent(),
            new SuperMap.Control.ZoomOut()
        ]);
    },

    CLASS_NAME: "SuperMap.Control.ZoomPanel"
});
