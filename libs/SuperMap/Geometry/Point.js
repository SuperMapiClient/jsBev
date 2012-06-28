/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry.js
 */

/**
 * Class: SuperMap.Geometry.Point
 * 点几何对象类。
 * 
 * Inherits from:
 *  - <SuperMap.Geometry> 
 */
SuperMap.Geometry.Point = SuperMap.Class(SuperMap.Geometry, {

    /** 
     * APIProperty: x 
     * {float} 
     */
    x: null,

    /** 
     * APIProperty: y 
     * {float} 
     */
    y: null,

    /**
     * Constructor: SuperMap.Geometry.Point
     * 实例化点对象。
     * (code)
     *  var point = new SuperMap.Geometry.Point(-111.04, 45.68);
     * (end)
     *
     * Parameters:
     * x - {float} x-坐标
     * y - {float} y-坐标
     * 
     */
    initialize: function(x, y) {
        SuperMap.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

    /**
     * APIMethod: clone
     * 
     * Returns:
     * {<SuperMap.Geometry.Point>} 克隆点对象。
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new SuperMap.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        SuperMap.Util.applyDefaults(obj, this);

        return obj;
    },

    /** 
     * Method: calculateBounds
     * Create a new Bounds based on the lon/lat
     */
    calculateBounds: function () {
        this.bounds = new SuperMap.Bounds(this.x, this.y,
                                            this.x, this.y);
    },

    /**
     * APIMethod: distanceTo
     * 计算两个几何对象间的最小距离（x-y平面坐标系下）。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 目标几何对象。
     * options - {Object} 计算距离时需要设置的可选属性。有效的选项取决于特定的几何类型。
     *
     * Valid options:
     * details - {Boolean} 返回距离计算的细节。默认为false。
     * edge - {Boolean} 计算一个几何对象到目标几何对象边缘的最近距离。默认为true。 如果设为true，
     * 一个几何对象完全包含在目标几何对象中时，调用distanceTo返回非零结果，如果false，两个几何对象相交情况下
     * 调用distanceTo结果返回0，而且如果false，将不返距离。
     *
     * Returns:
     * {Number | Object} 返回一个几何对象到目标几何对象的距离。
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if(geometry instanceof SuperMap.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {x0: x0, y0: y0, x1: x1, y1: y1, distance: distance};
        } else {
            result = geometry.distanceTo(this, options);
            if(details) {
                // switch coord order since this geom is target
                result = {
                    x0: result.x1, y0: result.y1,
                    x1: result.x0, y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },
    
    /** 
     * APIMethod: equals
     * 判断两个几何对象是否相等。如果所有的组件（components）具有相同的坐标，则几何对象认为是相等的。
     * 
     * Parameters:
     * geom - {<SuperMap.Geometry.Point>} 需要判断的几何对象。
     *
     * Returns:
     * {Boolean} 判断两个几何对象是否相等。
     */
    equals: function(geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    
    /**
     * Method: toShortString
     *
     * Returns:
     * {String} Shortened String representation of Point object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString: function() {
        return (this.x + ", " + this.y);
    },
    
    /**
     * APIMethod: move
     * 沿着x、y轴的正方向上按照给定的位移移动几何对象，move 不仅改变了几何对象的位置并且清理了边界缓存。
     *
     * Parameters:
     * x - {Float} x轴正方向上的偏移量。
     * y - {Float} y轴正方向上偏移量。
     */
    move: function(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },

    /**
     * APIMethod: rotate
     * 围绕中心点旋转几何对象。
     *
     * Parameters:
     * angle - {Float} 旋转角的度数（沿着x轴正方向的逆时针方向）。
     * origin - {<SuperMap.Geometry.Point>} 旋转的中心点 。
     */
    rotate: function(angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },
    
    /**
     * APIMethod: getCentroid
     *
     * Returns:
     * {<SuperMap.Geometry.Point>} 集合的质心。
     */
    getCentroid: function() {
        return new SuperMap.Geometry.Point(this.x, this.y);
    },

    /**
     * APIMethod: resize
     * 调整几何对象相对于原点的大小。
     *
     * Parameters:
     * scale - {Float} resize之后到原点的距离与resize之前到原点的距离比。
     * origin - {<SuperMap.Geometry.Point>} 调整的起始点
     * ratio - {Float} 可选的x,y比例，默认的比例为1,不推荐设置。
     * 
     * Returns:
     * {SuperMap.Geometry} - 当前几何对象。 
     */
    resize: function(scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },
    
    /**
     * APIMethod: intersects
     * 判断两个几何对象是否相交。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 任意类型的几何对象。
     *
     * Returns:
     * {Boolean} 传入的几何对象与当前几何对象相交。
     */
    intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "SuperMap.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * APIMethod: transform
     * 投影转换。
     * 
     * Parameters:
     * source - {<SuperMap.Projection>} 源对象投影
     * dest - {<SuperMap.Projection>} 目标对象投影
     * 
     * Returns:
     * {<SuperMap.Geometry>} 
     */
    transform: function(source, dest) {
        if ((source && dest)) {
            SuperMap.Projection.transform(
                this, source, dest); 
            this.bounds = null;
        }       
        return this;
    },

    /**
     * APIMethod: getVertices
     * 返回几何对象的所有顶点的列表。
     *
     * Parameters:
     * nodes - {Boolean} 对于线来说，仅仅返回作为端点的顶点，如果设为false，则返回非端点的顶点
     * 如果没有设置此参数，则返回所有顶点。
     *
     * Returns:
     * {Array} 几何图形的顶点列表。
     */
    getVertices: function(nodes) {
        return [this];
    },

    CLASS_NAME: "SuperMap.Geometry.Point"
});
