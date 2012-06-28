/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

/**
 * Class: SuperMap.Size
 * 此类描绘一对高宽值的实例。
 */
SuperMap.Size = SuperMap.Class({

    /**
     * APIProperty: w
     * {Number} 宽
     */
    w: 0.0,
    
    /**
     * APIProperty: h
     * {Number} 高
     */
    h: 0.0,


    /**
     * Constructor: SuperMap.Size
     * 创建Size实例。如：
     * (start code)	 
     * var size = new SuperMap.Size(31,46);
     * (end)
     * 	 
     * Parameters:
     * w - {Number} 宽度
     * h - {Number} 高度
     */
    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

    /**
     * Method: toString
     * Return the string representation of a size object
     *
     * Returns:
     * {String} The string representation of SuperMap.Size object. 
     * (e.g. <i>"w=55,h=66"</i>)
     */
    toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    /**
     * APIMethod: clone
     * 克隆当前size对象.
     *
     * Returns:
     * {<SuperMap.Size>} SuperMap.Size返回一个新的与当前size有相同宽、高的Size对象。
     */
    clone:function() {
        return new SuperMap.Size(this.w, this.h);
    },

    /**
     *
     * APIMethod: equals
     * 比较两个size是否相等
     *
     * Parameters:
     * sz - {<SuperMap.Size>} 
     *
     * Returns: 
     * {Boolean} 传入的size和当前size高宽相等，注意：如果传入的size为空则返回false
     *
     */
    equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "SuperMap.Size"
});
