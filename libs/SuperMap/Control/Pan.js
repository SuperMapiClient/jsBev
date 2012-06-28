/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 */

/**
 * Class: SuperMap.Control.Pan
 * 处理地图上各方向像素距离的移动控件,实现在各方向上平移地图。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.Pan = SuperMap.Class(SuperMap.Control, {

    /** 
     * APIProperty: slideFactor
     * {Integer} 该控件表示每个方向平移一次的像素数量，默认为50像素。可以用{<slideRatio>}实现平移一次地图移动的比例。
     */
    slideFactor: 50,

    /** 
     * APIProperty: slideRatio
     * {Number} 该控件每一个方向平移一次地图的移动比例。默认为null，如果设置该属性，会覆盖slideFactor属性值。
     * 例如：该属性值为0.5，移动距离为地图高度的一半。
     */
    slideRatio: null,

    /** 
     * Property: direction
     * {String} in {'North', 'South', 'East', 'West'}
     */
    direction: null,

    /**
     * Property: type
     * {String} The type of <SuperMap.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: SuperMap.Control.TYPE_BUTTON,

    /**
     * Constructor: SuperMap.Control.Pan 
     * 平移地图控件。
     *
     * Parameters:
     * direction - {String} 平移的方向。
     * options - {Object} 控制控件时可用的可选属性。
     */
    initialize: function(direction, options) {
    
        this.direction = direction;
        this.CLASS_NAME += this.direction;
        
        SuperMap.Control.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: trigger
     */
    trigger: function(){
    
        var getSlideFactor = SuperMap.Function.bind(function (dim) {
            return this.slideRatio ?
                this.map.getSize()[dim] * this.slideRatio :
                this.slideFactor;
        }, this);

        switch (this.direction) {
            case SuperMap.Control.Pan.NORTH: 
                this.map.pan(0, -getSlideFactor("h"));
                break;
            case SuperMap.Control.Pan.SOUTH: 
                this.map.pan(0, getSlideFactor("h"));
                break;
            case SuperMap.Control.Pan.WEST: 
                this.map.pan(-getSlideFactor("w"), 0);
                break;
            case SuperMap.Control.Pan.EAST: 
                this.map.pan(getSlideFactor("w"), 0);
                break;
        }
    },

    CLASS_NAME: "SuperMap.Control.Pan"
});

SuperMap.Control.Pan.NORTH = "North";
SuperMap.Control.Pan.SOUTH = "South";
SuperMap.Control.Pan.EAST = "East";
SuperMap.Control.Pan.WEST = "West";
