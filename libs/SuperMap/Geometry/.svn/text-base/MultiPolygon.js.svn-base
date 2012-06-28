/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry/Collection.js
 * @requires SuperMap/Geometry/Polygon.js
 */

/**
 * Class: SuperMap.Geometry.MultiPolygon
 * 
 * Inherits from:
 *  - <SuperMap.Geometry.Collection>
 */
SuperMap.Geometry.MultiPolygon = SuperMap.Class(
  SuperMap.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["SuperMap.Geometry.Polygon"],

    /**
     * Constructor: SuperMap.Geometry.MultiPolygon
     * 实例化 MultiPolygon 对象。
     *
     * Parameters:
     * components - {Array(<SuperMap.Geometry.Polygon>)} 形成 MultiPolygon 的多边形数组。
     */
    initialize: function(components) {
        SuperMap.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },

    CLASS_NAME: "SuperMap.Geometry.MultiPolygon"
});
