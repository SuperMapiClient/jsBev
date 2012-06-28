/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Geometry/Collection.js
 * @requires SuperMap/Geometry/Point.js
 */

/**
 * Class: SuperMap.Geometry.MultiPoint
 *
 * Inherits from:
 *  - <SuperMap.Geometry.Collection>
 *  - <SuperMap.Geometry>
 */
SuperMap.Geometry.MultiPoint = SuperMap.Class(
  SuperMap.Geometry.Collection, {

    /**
     * Property: componentTypes
     * {Array(String)} An array of class names representing the types of
     * components that the collection can include.  A null value means the
     * component types are not restricted.
     */
    componentTypes: ["SuperMap.Geometry.Point"],

    /**
     * Constructor: SuperMap.Geometry.MultiPoint
     * 实例化 MultiPoint 几何对象。
     *
     * Parameters:
     * components - {Array(<SuperMap.Geometry.Point>)} 
     *
     * Returns:
     * {<SuperMap.Geometry.MultiPoint>}
     */
    initialize: function(components) {
        SuperMap.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },

    /**
     * APIMethod: addPoint
     * 添加点，封装了 <SuperMap.Geometry.Collection.addComponent>}方法。
     *
     * Parameters:
     * point - {<SuperMap.Geometry.Point>} 添加的点
     * index - {Integer} 可选的下标
     */
    addPoint: function(point, index) {
        this.addComponent(point, index);
    },
    
    /**
     * APIMethod: removePoint
     * 移除点,封装了 <SuperMap.Geometry.Collection.removeComponent> 方法。
     *
     * Parameters:
     * point - {<SuperMap.Geometry.Point>} 移除的点对象。
     */
    removePoint: function(point){
        this.removeComponent(point);
    },

    CLASS_NAME: "SuperMap.Geometry.MultiPoint"
});
