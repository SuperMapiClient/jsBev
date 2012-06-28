/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 */

/**
 * Class: SuperMap.Bounds
 * 表示边界类实例。使用bounds之前需要设置left,bottom, right, top四个属性，这些属性的初始值为null。
 * 
 * 例如:
 * (code)
 *     bounds = new SuperMap.Bounds();
 *     bounds.extend(new SuperMap.LonLat(4,5));
 *     bounds.extend(new SuperMap.LonLat(5,6));
 *     bounds.toBBOX(); // returns 4,5,5,6
 * (end)
 */
SuperMap.Bounds = SuperMap.Class({

    /**
     * Property: left
     * {Number} 最小的水平坐标系。
     */
    left: null,

    /**
     * Property: bottom
     * {Number} 最小的垂直坐标系。
     */
    bottom: null,

    /**
     * Property: right
     * {Number} 最大的水平坐标系。
     */
    right: null,

    /**
     * Property: top
     * {Number} 最大的垂直坐标系。
     */
    top: null,
    
    /**
     * Property: centerLonLat
     * {<SuperMap.LonLat>} bounds的地图空间的中心点。用 <getCenterLonLat> 获得。
     */
    centerLonLat: null,

    /**
     * Constructor: SuperMap.Bounds
     * 创建新的bounds对象。
     *
     * Parameters:
     * left - {Number} 左边界，注意考虑宽度，理论上小于right值。
     * bottom - {Number} 下边界。考虑高度，理论大于top值
     * right - {Number} 右边界
     * top - {Number} 上边界
     */
    initialize: function(left, bottom, right, top) {
        if (left != null) {
            this.left = SuperMap.Util.toFloat(left);
        }
        if (bottom != null) {
            this.bottom = SuperMap.Util.toFloat(bottom);
        }
        if (right != null) {
            this.right = SuperMap.Util.toFloat(right);
        }
        if (top != null) {
            this.top = SuperMap.Util.toFloat(top);
        }
    },

    /**
     * Method: clone
     * 复制当前 bounds 对象。
     *
     * Returns:
     * {<SuperMap.Bounds>} 返回一个克隆的bounds
     */
    clone:function() {
        return new SuperMap.Bounds(this.left, this.bottom, 
                                     this.right, this.top);
    },

    /**
     * Method: equals
     * Test a two bounds for equivalence.
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>}
     *
     * Returns:
     * {Boolean} The passed-in bounds object has the same left,
     *           right, top, bottom components as this.  Note that if bounds 
     *           passed in is null, returns false.
     */
    equals:function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    },

    /** 
     * APIMethod: toString
     * 
     * Returns:
     * {String} 边界对象的字符串表示形式（left,bottom,top,right）。
     */
    toString:function() {
        return [this.left, this.bottom, this.right, this.top].join(",");
    },

    /**
     * APIMethod: toArray
     *
     * Parameters:
     * reverseAxisOrder - {Boolean} 是否反转轴顺序，
     * 如果设为true，则倒转顺序（bottom,left,top,right）,否则按正常轴顺序（left,bottom,right,top）。
     *
     * Returns:
     * {Array} left, bottom, right, top数组
     */
    toArray: function(reverseAxisOrder) {
        if (reverseAxisOrder === true) {
            return [this.bottom, this.left, this.top, this.right];
        } else {
            return [this.left, this.bottom, this.right, this.top];
        }
    },    

    /** 
     * APIMethod: toBBOX
     * 
     * Parameters:
     * decimal - {Integer} 边界方位坐标的有效数字个数，默认为6
     * reverseAxisOrder - {Boolean} 是否是反转轴顺序。
     * 如果设为true，则倒转顺序（bottom,left,top,right）,否则按正常轴顺序（left,bottom,right,top）。
     * 
     * Returns:
     * {String} 边界对象的字符串表示形式。
     *          (e.g. <i>"5,42,10,45"</i>)
     */
    toBBOX:function(decimal, reverseAxisOrder) {
        if (decimal== null) {
            decimal = 6; 
        }
        var mult = Math.pow(10, decimal);
        var xmin = Math.round(this.left * mult) / mult;
        var ymin = Math.round(this.bottom * mult) / mult;
        var xmax = Math.round(this.right * mult) / mult;
        var ymax = Math.round(this.top * mult) / mult;
        if (reverseAxisOrder === true) {
            return ymin + "," + xmin + "," + ymax + "," + xmax;
        } else {
            return xmin + "," + ymin + "," + xmax + "," + ymax;
        }
    },
 
    /**
     * APIMethod: toGeometry
     * 基于当前边界范围创建一个新的多边形对象
     *
     * Returns:
     * {<SuperMap.Geometry.Polygon>} 基于当前bounds坐标创建的新的多边形.
     */
    toGeometry: function() {
        return new SuperMap.Geometry.Polygon([
            new SuperMap.Geometry.LinearRing([
                new SuperMap.Geometry.Point(this.left, this.bottom),
                new SuperMap.Geometry.Point(this.right, this.bottom),
                new SuperMap.Geometry.Point(this.right, this.top),
                new SuperMap.Geometry.Point(this.left, this.top)
            ])
        ]);
    },
    
    /**
     * APIMethod: getWidth
     * 
     * Returns:
     * {Float} 获取边界宽度（right减去left）

     */
    getWidth:function() {
        return (this.right - this.left);
    },

    /**
     * APIMethod: getHeight
     * 
     * Returns:
     * {Float} 获取边界高度（top减去bottom）。
     */
    getHeight:function() {
        return (this.top - this.bottom);
    },

    /**
     * APIMethod: getSize
     * 
     * Returns:
     * {<SuperMap.Size>} 获取边框大小。
     */
    getSize:function() {
        return new SuperMap.Size(this.getWidth(), this.getHeight());
    },

    /**
     * APIMethod: getCenterPixel
     * 
     * Returns:
     * {<SuperMap.Pixel>} 在像素空间上的边界的中心点
     */
    getCenterPixel:function() {
        return new SuperMap.Pixel( (this.left + this.right) / 2,
                                     (this.bottom + this.top) / 2);
    },

    /**
     * APIMethod: getCenterLonLat
     * 
     * Returns:
     * {<SuperMap.LonLat>} 在地图空间上的边界的中心点.
     */
    getCenterLonLat:function() {
        if(!this.centerLonLat) {
            this.centerLonLat = new SuperMap.LonLat(
                (this.left + this.right) / 2, (this.bottom + this.top) / 2
            );
        }
        return this.centerLonLat;
    },

    /**
     * APIMethod: scale
     * 比例尺。
     * 
     * Parameters:
     * ratio - {Float} 
     * origin - {<SuperMap.Pixel> or <SuperMap.LonLat>}
     *          默认为center。
     *
     * Returns:
     * {<SuperMap.Bounds>} 返回通过ratio、origin计算得到的新的边界范围。
     */
    scale: function(ratio, origin){
        if(origin == null){
            origin = this.getCenterLonLat();
        }
        
        var origx,origy;

        // get origin coordinates
        if(origin.CLASS_NAME == "SuperMap.LonLat"){
            origx = origin.lon;
            origy = origin.lat;
        } else {
            origx = origin.x;
            origy = origin.y;
        }

        var left = (this.left - origx) * ratio + origx;
        var bottom = (this.bottom - origy) * ratio + origy;
        var right = (this.right - origx) * ratio + origx;
        var top = (this.top - origy) * ratio + origy;
        
        return new SuperMap.Bounds(left, bottom, right, top);
    },

    /**
     * APIMethod: add
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * 
     * Returns:
     * {<SuperMap.Bounds>} 返回一个新的bounds，此bounds的坐标是由传入的x，y参数与当前bounds坐标计算所得。
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            return null;
        }
        return new SuperMap.Bounds(this.left + x, this.bottom + y,
                                     this.right + x, this.top + y);
    },
    
    /**
     * APIMethod: extend
     * bounds扩展应用，支持point，lanlat和bounds,执行此函数时需要left < right ，bottom < top。
     * 
     * Parameters: 
     * object - {Object} 可以是point，lanlat和bounds。
     */
    extend:function(object) {
        var bounds = null;
        if (object) {
            // clear cached center location
            switch(object.CLASS_NAME) {
                case "SuperMap.LonLat":    
                    bounds = new SuperMap.Bounds(object.lon, object.lat,
                                                    object.lon, object.lat);
                    break;
                case "SuperMap.Geometry.Point":
                    bounds = new SuperMap.Bounds(object.x, object.y,
                                                    object.x, object.y);
                    break;
                    
                case "SuperMap.Bounds":    
                    bounds = object;
                    break;
            }
    
            if (bounds) {
                this.centerLonLat = null;
                if ( (this.left == null) || (bounds.left < this.left)) {
                    this.left = bounds.left;
                }
                if ( (this.bottom == null) || (bounds.bottom < this.bottom) ) {
                    this.bottom = bounds.bottom;
                } 
                if ( (this.right == null) || (bounds.right > this.right) ) {
                    this.right = bounds.right;
                }
                if ( (this.top == null) || (bounds.top > this.top) ) { 
                    this.top = bounds.top;
                }
            }
        }
    },

    /**
     * APIMethod: containsLonLat
     * 	 
     * Parameters:
     * ll - {<SuperMap.LonLat>} 
     * inclusive - {Boolean} 否包含边界，默认为true。
     *
     * Returns:
     * {Boolean} 传入的经纬度坐标在当前边界范围之内。
     */
    containsLonLat:function(ll, inclusive) {
        return this.contains(ll.lon, ll.lat, inclusive);
    },

    /**
     * APIMethod: containsPixel
     * 
     * Parameters:
     * px - {<SuperMap.Pixel>} 
     * inclusive - {Boolean} 是否包含边界，默认为true
     *
     * Returns:
     * {Boolean} 传入的pixel在当前边界范围之内。
     */
    containsPixel:function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    
    /**
     * APIMethod: contains
     * 
     * Parameters:
     * x - {Float} 
     * y - {Float} 
     * inclusive - {Boolean} 是否包含边界，默认为true
     *
     * Returns:
     * {Boolean} 传入的x,y坐标在当前范围内。
     */
    contains:function(x, y, inclusive) {
        //set default
        if (inclusive == null) {
            inclusive = true;
        }

        if (x == null || y == null) {
            return false;
        }

        x = SuperMap.Util.toFloat(x);
        y = SuperMap.Util.toFloat(y);

        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && 
                        (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && 
                        (y > this.bottom) && (y < this.top));
        }              
        return contains;
    },

    /**
     * APIMethod: intersectsBounds
     * 判断目标边界范围是否与当前边界范围相交。
     * 如果两个边界范围中的任意边缘相交或者一个边界包含了另外一个就认为这两个边界相交。
     * 
     * Parameters:
     * bounds - {<SuperMap.Bounds>} 目标边界。
     * inclusive - {Boolean} 边缘重合也看成相交，默认为true。
     * 如果是false，两个边界范围没有重叠部分仅仅是在边缘相接（重合），这种情况被认为没有相交。
     *
     * Returns:
     * {Boolean} 传入的bounds对象与当前bounds相交。
     */
    intersectsBounds:function(bounds, inclusive) {
        if (inclusive == null) {
            inclusive = true;
        }
        var intersects = false;
        var mightTouch = (
            this.left == bounds.right ||
            this.right == bounds.left ||
            this.top == bounds.bottom ||
            this.bottom == bounds.top
        );
        
        // if the two bounds only touch at an edge, and inclusive is false,
        // then the bounds don't *really* intersect.
        if (inclusive || !mightTouch) {
            // otherwise, if one of the boundaries even partially contains another,
            // inclusive of the edges, then they do intersect.
            var inBottom = (
                ((bounds.bottom >= this.bottom) && (bounds.bottom <= this.top)) ||
                ((this.bottom >= bounds.bottom) && (this.bottom <= bounds.top))
            );
            var inTop = (
                ((bounds.top >= this.bottom) && (bounds.top <= this.top)) ||
                ((this.top > bounds.bottom) && (this.top < bounds.top))
            );
            var inLeft = (
                ((bounds.left >= this.left) && (bounds.left <= this.right)) ||
                ((this.left >= bounds.left) && (this.left <= bounds.right))
            );
            var inRight = (
                ((bounds.right >= this.left) && (bounds.right <= this.right)) ||
                ((this.right >= bounds.left) && (this.right <= bounds.right))
            );
            intersects = ((inBottom || inTop) && (inLeft || inRight));
        }
        return intersects;
    },
    
    /**
     * APIMethod: containsBounds
     * 判断目标边界是否被当前边界包含在内。
     * 
     * bounds - {<SuperMap.Bounds>} 目标边界。
     * partial - {Boolean} 目标边界的任意部分都包含在当前边界中则被认为是包含关系。默认为false，
     * 如果设为false，整个目标边界全部被包含在当前边界范围内。
     * inclusive - {Boolean} 边缘共享被视为包含。默认为true 
     *
     * Returns:
     * {Boolean} 传入的边界被当前边界包含。
     */
    containsBounds:function(bounds, partial, inclusive) {
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }
        var bottomLeft  = this.contains(bounds.left, bounds.bottom, inclusive);
        var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
        var topLeft  = this.contains(bounds.left, bounds.top, inclusive);
        var topRight = this.contains(bounds.right, bounds.top, inclusive);
        
        return (partial) ? (bottomLeft || bottomRight || topLeft || topRight)
                         : (bottomLeft && bottomRight && topLeft && topRight);
    },

    /** 
     * APIMethod: determineQuadrant
     * 
     * Parameters:
     * lonlat - {<SuperMap.LonLat>}
     * 
     * Returns:
     * {String} 边界坐标所在的象限(“br” “tr” “tl” “bl”).
     */
    determineQuadrant: function(lonlat) {
    
        var quadrant = "";
        var center = this.getCenterLonLat();
        
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
    
        return quadrant; 
    },
    
    /**
     * APIMethod: transform
     * 边界对象的投影转换。
     *
     * Parameters: 
     * source - {<SuperMap.Projection>} 源投影。
     * dest   - {<SuperMap.Projection>} 目标投影。
     *
     * Returns:
     * {<SuperMap.Bounds>} 返回本身，用于链接操作.
     */
    transform: function(source, dest) {
        // clear cached center location
        this.centerLonLat = null;
        var ll = SuperMap.Projection.transform(
            {'x': this.left, 'y': this.bottom}, source, dest);
        var lr = SuperMap.Projection.transform(
            {'x': this.right, 'y': this.bottom}, source, dest);
        var ul = SuperMap.Projection.transform(
            {'x': this.left, 'y': this.top}, source, dest);
        var ur = SuperMap.Projection.transform(
            {'x': this.right, 'y': this.top}, source, dest);
        this.left   = Math.min(ll.x, ul.x);
        this.bottom = Math.min(ll.y, lr.y);
        this.right  = Math.max(lr.x, ur.x);
        this.top    = Math.max(ul.y, ur.y);
        return this;
    },

    /**
     * APIMethod: wrapDateLine
     * 
     * Parameters:
     * maxExtent - {<SuperMap.Bounds>} 最大的边界范围
     * options - {Object} 可选对象包括:
     *
     * Allowed Options:
     *                    leftTolerance - {float} left允许的误差。默认为0 
     *                    rightTolerance - {float} right允许的误差。默认为0
     * 
     * Returns:
     * {<SuperMap.Bounds>} 克隆当前边界。如果当前边界完全在最大范围之外此函数则返回一个不同值的边界，
     * 若落在最大边界的左边，则给当前的bounds值加上最大范围的宽度，即向右移动，
     * 若落在右边，则向左移动，即给当前的bounds值加上负的最大范围的宽度。
     */
    wrapDateLine: function(maxExtent, options) {    
        options = options || {};
        
        var leftTolerance = options.leftTolerance || 0;
        var rightTolerance = options.rightTolerance || 0;

        var newBounds = this.clone();
    
        if (maxExtent) {

           //shift right?
           while ( newBounds.left < maxExtent.left && 
                   (newBounds.right - rightTolerance) <= maxExtent.left ) { 
                newBounds = newBounds.add(maxExtent.getWidth(), 0);
           }

           //shift left?
           while ( (newBounds.left + leftTolerance) >= maxExtent.right && 
                   newBounds.right > maxExtent.right ) { 
                newBounds = newBounds.add(-maxExtent.getWidth(), 0);
           }
        }
                
        return newBounds;
    },

    CLASS_NAME: "SuperMap.Bounds"
});

/** 
 * APIFunction: fromString
 * 字符串参数创建新的bounds的构造函数
 * 
 * Parameters: 
 * str - {String} 边界字符串，用逗号隔开 (e.g. <i>"5,42,10,45"</i>)
 * reverseAxisOrder - {Boolean} 是否反转轴顺序.
 * 如果设为true，则倒转顺序（bottom,left,top,right）,否则按正常轴顺序（left,bottom,right,top）。
 * 
 * Returns:
 * {<SuperMap.Bounds>} 返回给定的字符串创建的新的边界对象
 */
SuperMap.Bounds.fromString = function(str, reverseAxisOrder) {
    var bounds = str.split(",");
    return SuperMap.Bounds.fromArray(bounds, reverseAxisOrder);
};

/** 
 * APIFunction: fromArray
 * 边界框数组创建边界
 * 
 * Parameters:
 * bbox - {Array(Float)} 边界值数组 (e.g. <i>[5,42,10,45]</i>)
 * reverseAxisOrder - {Boolean} 是否是反转轴顺序
 * 如果设为true，则倒转顺序（bottom,left,top,right）,否则按正常轴顺序（left,bottom,right,top）。
 *
 * Returns:
 * {<SuperMap.Bounds>} 返回根据传入的数组创建的新的边界对象。
 */
SuperMap.Bounds.fromArray = function(bbox, reverseAxisOrder) {
    return reverseAxisOrder === true ?
           new SuperMap.Bounds(parseFloat(bbox[1]),
                                 parseFloat(bbox[0]),
                                 parseFloat(bbox[3]),
                                 parseFloat(bbox[2])) :
           new SuperMap.Bounds(parseFloat(bbox[0]),
                                 parseFloat(bbox[1]),
                                 parseFloat(bbox[2]),
                                 parseFloat(bbox[3]));
};

/** 
 * APIFunction: fromSize
 * 创建传入的边界大小的创建新的边界。
 * 
 * Parameters:
 * size - {<SuperMap.Size>} 
 *
 * Returns:
 * {<SuperMap.Bounds>} 返回根据传入的边界大小的创建新的边界。
 */
SuperMap.Bounds.fromSize = function(size) {
    return new SuperMap.Bounds(0,
                                 size.h,
                                 size.w,
                                 0);
};

/**
 * Function: oppositeQuadrant
 * Get the opposite quadrant for a given quadrant string.
 *
 * Parameters:
 * quadrant - {String} two character quadrant shortstring
 *
 * Returns:
 * {String} The opposing quadrant ("br" "tr" "tl" "bl"). For Example, if 
 *          you pass in "bl" it returns "tr", if you pass in "br" it 
 *          returns "tl", etc.
 */
SuperMap.Bounds.oppositeQuadrant = function(quadrant) {
    var opp = "";
    
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    
    return opp;
};
