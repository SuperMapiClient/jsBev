/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

/**
 * Class: SuperMap.Pixel
 * 此类用X,Y坐标描绘屏幕坐标。
 */
SuperMap.Pixel = SuperMap.Class({
    
    /**
     * APIProperty: x
     * {Number} x坐标
     */
    x: 0.0,

    /**
     * APIProperty: y
     * {Number} y坐标
     */
    y: 0.0,
    
    /**
     * Constructor: SuperMap.Pixel
     * 创建新的SuperMap.Pixel实例,如：
     * (start code)	 
     *  var size = new OpenLayers.Size(21,25);
     *	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
     * (end)	 
     *		 
     * Parameters:
     * x - {Number} x坐标
     * y - {Number} y坐标
     *
     * Returns:
     * 返回SuperMap.Pixel实例
     */
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
    /**
     * Method: toString
     * Cast this object into a string
     *
     * Returns:
     * {String} The string representation of Pixel. ex: "x=200.4,y=242.2"
     */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /**
     * APIMethod: clone
     * 克隆的当前的pixel对象。
     *
     * Returns:
     * {<SuperMap.Pixel>} 表示pixel的字符串。例如:"x=200.4,y=242.2"
     */
    clone:function() {
        return new SuperMap.Pixel(this.x, this.y); 
    },
    
    /**
     * APIMethod: equals
     * 比较两像素是否相等
     *
     * Parameters:
     * px - {<SuperMap.Pixel>} 
     *
     * Returns:
     * {Boolean} 如果传入的像素点和当前像素点相同返回true,如果不同或传入参数为NULL则返回false
     */
    equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    /**
     * APIMethod: distanceTo
     * 返回作为一个参数传递到像素点的距离。
     *
     * Parameters:
     * px - {<SuperMap.Pixel>} 
     *
     * Returns:
     * {Float} 作为参数传入的像素与当前像素点的距离。
     */
    distanceTo:function(px) {
        return Math.sqrt(
            Math.pow(this.x - px.x, 2) +
            Math.pow(this.y - px.y, 2)
        );
    },

    /**
     * APIMethod: add
     *
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     *
     * Returns:
     * {<SuperMap.Pixel>} 返回一个新的pixel，该pixel是由当前的pixel与传入的x,y相加得到。
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            return null;
        }
        return new SuperMap.Pixel(this.x + x, this.y + y);
    },

    /**
    * APIMethod: offset
    * 
    * Parameters
    * px - {<SuperMap.Pixel>}
    * 
    * Returns:
    * {<SuperMap.Pixel>} 返回一个新的pixel，该pixel是由当前的pixel与传入的x,y相加得到。
    */
    offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "SuperMap.Pixel"
});
