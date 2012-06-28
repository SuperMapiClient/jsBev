/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry/Curve.js
 */

/**
 * Class: SuperMap.Geometry.LineString
 * 几何对象线串类。
 * 
 * Inherits from:
 *  - <SuperMap.Geometry.Curve>
 */
SuperMap.Geometry.LineString = SuperMap.Class(SuperMap.Geometry.Curve, {

    /**
     * Constructor: SuperMap.Geometry.LineString
     * 创建新的线串几何对象。
     *
     * Parameters:
     * points - {Array(<SuperMap.Geometry.Point>)} 用来生成线串的点数组。
     */
    initialize: function(points) {
        SuperMap.Geometry.Curve.prototype.initialize.apply(this, arguments);        
    },

    /**
     * APIMethod: removeComponent
     * 只有在线串上有三个或更多的点的时候，才会允许移动点（否则结果将会是单一的点）
     *
     * Parameters: 
     * point - {<SuperMap.Geometry.Point>} 将被删除的点。
     *
     * Returns: 
     * {Boolean} 删除的点。
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            SuperMap.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                  arguments);
        }
        return removed;
    },
    
    /**
     * APIMethod: intersects
     * 判断两个几何图形是否相交。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 任意的几何类型
     *
     * Returns:
     * {Boolean} 输入几何图形与当前几何图形是否相交。
     */
    intersects: function(geometry) {
        var intersect = false;
        var type = geometry.CLASS_NAME;
        if(type == "SuperMap.Geometry.LineString" ||
           type == "SuperMap.Geometry.LinearRing" ||
           type == "SuperMap.Geometry.Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if(type == "SuperMap.Geometry.Point") {
                segs2 = [{
                    x1: geometry.x, y1: geometry.y,
                    x2: geometry.x, y2: geometry.y
                }];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2,
                seg2, seg2y1, seg2y2;
            // sweep right
            outer: for(var i=0, len=segs1.length; i<len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for(var j=0, jlen=segs2.length; j<jlen; ++j) {
                    seg2 = segs2[j];
                    if(seg2.x1 > seg1x2) {
                        // seg1 still left of seg2
                        break;
                    }
                    if(seg2.x2 < seg1x1) {
                        // seg2 still left of seg1
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if(Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        // seg2 above seg1
                        continue;
                    }
                    if(Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        // seg2 below seg1
                        continue;
                    }
                    if(SuperMap.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
    /**
     * Method: getSortedSegments
     *
     * Returns:
     * {Array} An array of segment objects.  Segment objects have properties
     *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
     *     The end point is represented by x2 and y2.  Start and end are
     *     ordered so that x1 < x2.
     */
    getSortedSegments: function() {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg), point1, point2;
        for(var i=0; i<numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if(point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);
    },
    
    /**
     * Method: splitWithSegment
     * Split this geometry with the given segment.
     *
     * Parameters:
     * seg - {Object} An object with x1, y1, x2, and y2 properties referencing
     *     segment endpoint coordinates.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source segment must be within the
     *     tolerance distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of one of the source segment's
     *     endpoints will be assumed to occur at the endpoint.
     *
     * Returns:
     * {Object} An object with *lines* and *points* properties.  If the given
     *     segment intersects this linestring, the lines array will reference
     *     geometries that result from the split.  The points array will contain
     *     all intersection points.  Intersection points are sorted along the
     *     segment (in order from x1,y1 to x2,y2).
     */
    splitWithSegment: function(seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {point: true, tolerance: tolerance};
        var result = null;
        for(var i=0, stop=verts.length-2; i<=stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i+1];
            target = {x1: vert1.x, y1: vert1.y, x2: vert2.x, y2: vert2.y};
            point = SuperMap.Geometry.segmentsIntersect(
                seg, target, interOptions
            );
            if(point instanceof SuperMap.Geometry.Point) {
                if((point.x === seg.x1 && point.y === seg.y1) ||
                   (point.x === seg.x2 && point.y === seg.y2) ||
                   point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if(vertex || edge) {
                    // push intersections different than the previous
                    if(!point.equals(intersections[intersections.length-1])) {
                        intersections.push(point.clone());
                    }
                    if(i === 0) {
                        if(point.equals(vert1)) {
                            continue;
                        }
                    }
                    if(point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if(!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new SuperMap.Geometry.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if(split) {
            points.push(vert2.clone());
            lines.push(new SuperMap.Geometry.LineString(points));
        }
        if(intersections.length > 0) {
            // sort intersections along segment
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function(p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },

    /**
     * Method: split
     * Use this geometry (the source) to attempt to split a target geometry.
     * 
     * Parameters:
     * target - {<SuperMap.Geometry>} The target geometry.
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    split: function(target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if(target instanceof SuperMap.Geometry.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for(var i=0, stop=verts.length-2; i<=stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i+1];
                seg = {
                    x1: vert1.x, y1: vert1.y,
                    x2: vert2.x, y2: vert2.y
                };
                targetParts = targetParts || [target];
                if(mutual) {
                    points.push(vert1.clone());
                }
                for(var j=0; j<targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if(splits) {
                        // splice in new features
                        lines = splits.lines;
                        if(lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if(mutual) {
                            for(var k=0, len=splits.points.length; k<len; ++k) {
                                point = splits.points[k];
                                if(!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new SuperMap.Geometry.LineString(points));
                                    if(point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new SuperMap.Geometry.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetSplit || sourceSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * Method: splitWith
     * Split this geometry (the target) with the given geometry (the source).
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} A geometry used to split this
     *     geometry (the source).
     * options - {Object} Properties of this object will be used to determine
     *     how the split is conducted.
     *
     * Valid options:
     * mutual - {Boolean} Split the source geometry in addition to the target
     *     geometry.  Default is false.
     * edge - {Boolean} Allow splitting when only edges intersect.  Default is
     *     true.  If false, a vertex on the source must be within the tolerance
     *     distance of the intersection to be considered a split.
     * tolerance - {Number} If a non-null value is provided, intersections
     *     within the tolerance distance of an existing vertex on the source
     *     will be assumed to occur at the vertex.
     * 
     * Returns:
     * {Array} A list of geometries (of this same type as the target) that
     *     result from splitting the target with the source geometry.  The
     *     source and target geometry will remain unmodified.  If no split
     *     results, null will be returned.  If mutual is true and a split
     *     results, return will be an array of two arrays - the first will be
     *     all geometries that result from splitting the source geometry and
     *     the second will be all geometries that result from splitting the
     *     target geometry.
     */
    splitWith: function(geometry, options) {
        return geometry.split(this, options);

    },

    /**
     * APIMethod: getVertices
     * 返回几何图形的所有顶点的列表。
     *
     * Parameters:
     * nodes - {Boolean} 对于线来说，仅仅返回作为端点的顶点，如果设为false，则返回非端点的顶点
     * 如果没有设置此参数，则返回所有顶点。
     *
     * Returns:
     * {Array} 几何图形的顶点列表。
     */
    getVertices: function(nodes) {
        var vertices;
        if(nodes === true) {
            vertices = [
                this.components[0],
                this.components[this.components.length-1]
            ];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length-1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },

    /**
     * APIMethod: distanceTo
     * 计算两个几个图形间的最小距离（x-y平面坐标系下）。
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>} 目标几何图形。
     * options - {Object}距离计算需要设置的可选属性。有效的选项取决于特定的几何类型。
     *
     * Valid options:
     * details - {Boolean} 返回距离计算的细节。默认为false。
     * edge - {Boolean} 计算一个几何图形到目标几何图形边缘的最近距离。默认为true。 如果设为true，
     * 一个几何图形完全包含在目标几何图形中时，调用distanceTo返回非零结果，如果false，两个几何图形相交情况下
     * 调用distanceTo结果返回0，而且如果false，将不返距离。
     *
     * Returns:
     * {Number | Object} 返回一个几何图形到目标几何图形的距离。
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if(geometry instanceof SuperMap.Geometry.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for(var i=0, len=segs.length; i<len; ++i) {
                seg = segs[i];
                result = SuperMap.Geometry.distanceToSegment(geometry, seg);
                if(result.distance < min) {
                    min = result.distance;
                    best = result;
                    if(min === 0) {
                        break;
                    }
                } else {
                    // if distance increases and we cross y0 to the right of x0, no need to keep looking.
                    if(seg.x2 > x && ((y > seg.y1 && y < seg.y2) || (y < seg.y1 && y > seg.y2))) {
                        break;
                    }
                }
            }
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x, y0: best.y,
                    x1: x, y1: y
                };
            } else {
                best = best.distance;
            }
        } else if(geometry instanceof SuperMap.Geometry.LineString) { 
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {point: true};
            outer: for(var i=0, len=segs0.length; i<len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for(var j=0; j<len1; ++j) {
                    seg1 = segs1[j];
                    intersection = SuperMap.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if(intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x, y0: intersection.y,
                            x1: intersection.x, y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = SuperMap.Geometry.distanceToSegment({x: x0, y: y0}, seg1);
                        if(result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0, y0: y0,
                                x1: result.x, y1: result.y
                            };
                        }
                    }
                }
            }
            if(!details) {
                best = best.distance;
            }
            if(min !== 0) {
                // check the final vertex in this line's sorted segments
                if(seg0) {
                    result = geometry.distanceTo(
                        new SuperMap.Geometry.Point(seg0.x2, seg0.y2),
                        options
                    );
                    var dist = details ? result.distance : result;
                    if(dist < min) {
                        if(details) {
                            best = {
                                distance: min,
                                x0: result.x1, y0: result.y1,
                                x1: result.x0, y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            // swap since target comes from this line
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x1, y0: best.y1,
                    x1: best.x0, y1: best.y0
                };
            }
        }
        return best;
    },
    
    /**
     * APIMethod: simplify
     * 这个函数返回一个简化的线串，基于道格拉斯 - 普克简化算法进行简化。
     *
     * Parameters:
     * tolerance - {number} 地图单位上的简化的阈值。
     *
     * Returns:
     * {SuperMap.Geometry.LineString} 被简化的线串。
     */
    simplify: function(tolerance){
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }
    
            var compareNumbers = function(a, b){
                return (a-b);
            };
    
            /**
             * Private function doing the Douglas-Peucker reduction
             */
            var douglasPeuckerReduction = function(points, firstPoint, lastPoint, tolerance){
                var maxDistance = 0;
                var indexFarthest = 0;
    
                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }
    
                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    //Add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };
    
            /**
             * Private function calculating the perpendicular distance
             * TODO: check whether SuperMap.Geometry.LineString::distanceTo() is faster or slower
             */
            var perpendicularDistance = function(point1, point2, point){
                //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
                //Area = .5*Base*H                                          *Solve for height
                //Height = Area/.5/Base
    
                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;
    
                return height;
            };
    
            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];
    
            //Add the first and last index to the keepers
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);
    
            //The first and the last point cannot be the same
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                //Addition: the first point not equal to first point in the LineString is kept as well
                pointIndexsToKeep.push(lastPoint);
            }
    
            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new SuperMap.Geometry.LineString(returnPoints);
    
        }
        else {
            return this;
        }
    },

    CLASS_NAME: "SuperMap.Geometry.LineString"
});
