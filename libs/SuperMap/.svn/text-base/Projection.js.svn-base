/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/BaseTypes/Class.js
 * @requires SuperMap/Util.js
 */

/**
 * Class: SuperMap.Projection
 * 坐标转换类。这个类封装了与pro4js投影对象进行交互的几种方法。
 */
SuperMap.Projection = SuperMap.Class({

    /**
     * Property: proj
     * {Object} Proj4js.Proj instance.
     */
    proj: null,
    
    /**
     * Property: projCode
     * {String}
     */
    projCode: null,
    
    /**
     * Property: titleRegEx
     * {RegExp} regular expression to strip the title from a proj4js definition
     */
    titleRegEx: /\+title=[^\+]*/,

    /**
     * Constructor: SuperMap.Projection
     *
     * Parameters:
     * projCode - {String} 投影标识符字符串。
     * options - {Object} 设置图层上的的附加属性。
     *
     * Returns:
     * {<SuperMap.Projection>} 投影对象。
     */
    initialize: function(projCode, options) {
        SuperMap.Util.extend(this, options);
        this.projCode = projCode;
        if (window.Proj4js) {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    
    /**
     * APIMethod: getCode
     * 获取SRS代码字符串。
     *
     * Returns:
     * {String} SRS代码。
     */
    getCode: function() {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
   
    /**
     * APIMethod: getUnits
     * 获取投影的单位字符串。如果proj4js不可用则返回null。
     *
     * Returns:
     * {String} 获取的单位。
     */
    getUnits: function() {
        return this.proj ? this.proj.units : null;
    },

    /**
     * Method: toString
     * 将投影转换为字符串(内部封装了getCode方法)
     *
     * Returns:
     * {String} 投影代码。
     */
    toString: function() {
        return this.getCode();
    },

    /**
     * Method: equals
     * Test equality of two projection instances.  Determines equality based
     *     soley on the projection code.
     *
     * Returns:
     * {Boolean} The two projections are equivalent.
     */
    equals: function(projection) {
        var p = projection, equals = false;
        if (p) {
            if (window.Proj4js && this.proj.defData && p.proj.defData) {
                equals = this.proj.defData.replace(this.titleRegEx, "") ==
                    p.proj.defData.replace(this.titleRegEx, "");
            } else if (p.getCode) {
                var source = this.getCode(), target = p.getCode();
                equals = source == target ||
                    !!SuperMap.Projection.transforms[source] &&
                    SuperMap.Projection.transforms[source][target] ===
                        SuperMap.Projection.nullTransform;
            }
        }
        return equals;   
    },

    /* Method: destroy
     * Destroy projection object.
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    },
    
    CLASS_NAME: "SuperMap.Projection" 
});     

/**
 * Property: transforms
 * Transforms is an object, with from properties, each of which may
 * have a to property. This allows you to define projections without 
 * requiring support for proj4js to be included.
 *
 * This object has keys which correspond to a 'source' projection object.  The
 * keys should be strings, corresponding to the projection.getCode() value.
 * Each source projection object should have a set of destination projection
 * keys included in the object. 
 * 
 * Each value in the destination object should be a transformation function,
 * where the function is expected to be passed an object with a .x and a .y
 * property.  The function should return the object, with the .x and .y
 * transformed according to the transformation function.
 *
 * Note - Properties on this object should not be set directly.  To add a
 *     transform method to this object, use the <addTransform> method.  For an
 *     example of usage, see the SuperMap.Layer.SphericalMercator file.
 */
SuperMap.Projection.transforms = {};

/**
 * APIMethod: addTransform
 * 设置自定义投影转换方法。在proj4js库不可用或者自定义的投影需要处理时使用此方法。
 *
 * Parameters:
 * from - {String} 源投影代码。
 * to - {String} 目标投影代码。
 * method - {Function} 将作为参数的点的源投影转化为目标投影的方法。
 */
SuperMap.Projection.addTransform = function(from, to, method) {
    if(!SuperMap.Projection.transforms[from]) {
        SuperMap.Projection.transforms[from] = {};
    }
    SuperMap.Projection.transforms[from][to] = method;
};

/**
 * APIMethod: transform
 * 点投影转换。
 * 
 * Parameters:
 * point - {<SuperMap.Geometry.Point> | Object} 带有x,y坐标的点对象。
 * source - {SuperMap.Projection} 源地图坐标系统。
 * dest - {SuperMap.Projection} 目标地图坐标系统。
 *
 * Returns:
 * point - {object} 转换后的坐标。
 */
SuperMap.Projection.transform = function(point, source, dest) {
    if (source.proj && dest.proj) {
        point = Proj4js.transform(source.proj, dest.proj, point);
    } else if (source && dest && 
               SuperMap.Projection.transforms[source.getCode()] && 
               SuperMap.Projection.transforms[source.getCode()][dest.getCode()]) {
        SuperMap.Projection.transforms[source.getCode()][dest.getCode()](point); 
    }
    return point;
};

/**
 * APIFunction: nullTransform
 * 空转换，有用的定义投影的别名时proj4js不可用：当proj4js不可用时，用来定义投影的别名。
 *
 * (code)
 * SuperMap.Projection.addTransform("EPSG:4326", "EPSG:3857",
 *     SuperMap.Layer.SphericalMercator.projectForward);
 * SuperMap.Projection.addTransform("EPSG:3857", "EPSG:3857",
 *     SuperMap.Layer.SphericalMercator.projectInverse);
 * SuperMap.Projection.addTransform("EPSG:3857", "EPSG:900913",
 *     SuperMap.Projection.nullTransform);
 * SuperMap.Projection.addTransform("EPSG:900913", "EPSG:3857",
 *     SuperMap.Projection.nullTransform);
 * (end)
 */
SuperMap.Projection.nullTransform = function(point) {
    return point;
};
