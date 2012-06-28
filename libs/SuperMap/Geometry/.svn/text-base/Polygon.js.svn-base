/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry/Collection.js
 * @requires SuperMap/Geometry/LinearRing.js
 */

/**
 * Class: SuperMap.Geometry.Polygon 
 * 多边形几何对象类。
 * 
 * Inherits from:
 *  - <SuperMap.Geometry.Collection> 
 *  - <SuperMap.Geometry> 
 */
SuperMap.Geometry.Polygon = SuperMap.Class(
  SuperMap.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["SuperMap.Geometry.LinearRing"],

    /**
     * Constructor: SuperMap.Geometry.Polygon
     * 实例化多边形对象。
     * (code)
     *  var newPolygon = new OpenLayers.Geometry.Polygon([linearRing]);    
     * (end)
     * Parameters:
     * components - {Array(<SuperMap.Geometry.LinearRing>)} 
     */
    initialize: function(components) {
        SuperMap.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },
    
    /** 
     * APIMethod: getArea
     * 获得区域面积，从区域的外部口径减去此区域内部口径计算所得的面积。
     * 
     * Returns:
     * {float} 几何对象的面积
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },

    /** 
     * APIMethod: getGeodesicArea
     * 计算投影到球面上的多边形近似面积。
     *
     * Parameters:
     * projection - {<SuperMap.Projection>} 空间参考系统的几何坐标。如果没有设置，默认 WGS84。
     * 
     * Returns:
     * {float} 多边形近似测地面积。
     */
    getGeodesicArea: function(projection) {
        var area = 0.0;
        if(this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getGeodesicArea(projection));
            for(var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getGeodesicArea(projection));
            }
        }
        return area;
    },

    /**
     * Method: containsPoint
     * Test if a point is inside a polygon.  Points on a polygon edge are
     *     considered inside.
     *
     * Parameters:
     * point - {<SuperMap.Geometry.Point>}
     *
     * Returns:
     * {Boolean | Number} The point is inside the polygon.  Returns 1 if the
     *     point is on an edge.  Returns boolean otherwise.
     */
    containsPoint: function(point) {
        var numRings = this.components.length;
        var contained = false;
        if(numRings > 0) {
            // check exterior ring - 1 means on edge, boolean otherwise
            contained = this.components[0].containsPoint(point);
            if(contained !== 1) {
                if(contained && numRings > 1) {
                    // check interior rings
                    var hole;
                    for(var i=1; i<numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if(hole) {
                            if(hole === 1) {
                                // on edge
                                contained = 1;
                            } else {
                                // in hole
                                contained = false;
                            }                            
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },

    /**
     * APIMethod: intersects
     * 判断两个几何对象是否相交。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 任何类型的几何对象。
     *
     * Returns:
     * {Boolean} 两个几何对象是否相交。
     */
    intersects: function(geometry) {
        var intersect = false;
        var i, len;
        if(geometry.CLASS_NAME == "SuperMap.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.CLASS_NAME == "SuperMap.Geometry.LineString" ||
                  geometry.CLASS_NAME == "SuperMap.Geometry.LinearRing") {
            // check if rings/linestrings intersect
            for(i=0, len=this.components.length; i<len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if(intersect) {
                    break;
                }
            }
            if(!intersect) {
                // check if this poly contains points of the ring/linestring
                for(i=0, len=geometry.components.length; i<len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if(intersect) {
                        break;
                    }
                }
            }
        } else {
            for(i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = this.intersects(geometry.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        // check case where this poly is wholly contained by another
        if(!intersect && geometry.CLASS_NAME == "SuperMap.Geometry.Polygon") {
            // exterior ring points will be contained in the other geometry
            var ring = this.components[0];
            for(i=0, len=ring.components.length; i<len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },

    /**
     * APIMethod: distanceTo
     * 计算两个几何对象间的最小距离（x-y平面坐标系下）。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 目标几何对象。
     * options - {Object} 距离计算需要设置的可选属性。
     *
     * Valid options:
     * details - {Boolean} 返回距离计算的细节。默认为false。
     * edge - {Boolean} 计算一个几何对象到目标几何对象边缘的最近距离。默认为true。 如果设为true，
     * 一个几何图形完全包含在目标几何对象中时，调用distanceTo返回非零结果，如果false，两个几何对象相交情况下
     * 调用distanceTo结果返回0，而且如果false，将不返距离。
     *
     * Returns:
     * {Number | Object} 返回一个几何对象到目标几何对象的距离。
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        // this is the case where we might not be looking for distance to edge
        if(!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = SuperMap.Geometry.Collection.prototype.distanceTo.apply(
                this, [geometry, options]
            );
        }
        return result;
    },

    CLASS_NAME: "SuperMap.Geometry.Polygon"
});

/**
 * APIMethod: createRegularPolygon
 * 创建 RegularPolygon 对象。
 *
 * Parameters:
 * origin - {<SuperMap.Geometry.Point>} 多边形的中心 。
 * radius - {Float} 半径。
 * sides - {Integer} 边数，20个近似一个圆。
 * rotation - {Float} 旋转角度，单位为degrees.
 */
SuperMap.Geometry.Polygon.createRegularPolygon = function(origin, radius, sides, rotation) {  
    var angle = Math.PI * ((1/sides) - (1/2));
    if(rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for(var i=0; i<sides; ++i) {
        rotatedAngle = angle + (i * 2 * Math.PI / sides);
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new SuperMap.Geometry.Point(x, y));
    }
    var ring = new SuperMap.Geometry.LinearRing(points);
    return new SuperMap.Geometry.Polygon([ring]);
};
