/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry.js
 */

/**
 * Class: SuperMap.Geometry.Rectangle
 * 矩形几何对象类。
 * 
 * Inherits:
 *  - <SuperMap.Geometry>
 */

SuperMap.Geometry.Rectangle = SuperMap.Class(SuperMap.Geometry, {

    /** 
     * Property: x
     * {Float}
     */
    x: null,

    /** 
     * Property: y
     * {Float}
     */
    y: null,

    /** 
     * Property: width
     * {Float}
     */
    width: null,

    /** 
     * Property: height
     * {Float}
     */
    height: null,

    /**
     * Constructor: SuperMap.Geometry.Rectangle
     * 实例化矩形对象。
     * 
     * Parameters:
     * points - {Array(<SuperMap.Geometry.Point>)} 
     */
    initialize: function(x, y, width, height) {
        SuperMap.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    },
    
    /**
     * Method: calculateBounds
     * Recalculate the bounds for the geometry.
     */
    calculateBounds: function() {
        this.bounds = new SuperMap.Bounds(this.x, this.y,
                                            this.x + this.width, 
                                            this.y + this.height);
    },
    
    
    /**
     * APIMethod: getLength
     * 
     * Returns:
     * {Float} 获得几何对象的长度。
     */
    getLength: function() {
        var length = (2 * this.width) + (2 * this.height);
        return length;
    },

    /**
     * APIMethod: getArea
     * 
     * Returns:
     * {Float} 获得几何对象面积
     */
    getArea: function() {
        var area = this.width * this.height;
        return area;
    },    

    CLASS_NAME: "SuperMap.Geometry.Rectangle"
});
