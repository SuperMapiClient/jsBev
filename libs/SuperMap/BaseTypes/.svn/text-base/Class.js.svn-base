/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/SingleFile.js
 */

/**
 * Constructor: SuperMap.Class
 * 基类。 
 * 
 * 创建一个新的SuperMap类，如下所示：
 * (code)
 *     var MyClass = new SuperMap.Class(prototype);
 * (end)
 *
 * 创建一个新的有多个继承类的SuperMap类，如下所示:
 * (code)
 *     var MyClass = new SuperMap.Class(Class1, Class2, prototype);
 * (end)
 */
SuperMap.Class = function() {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len-1];

    var C = typeof F.initialize == "function" ?  F.initialize : function(){ P.prototype.initialize.apply(this, arguments); };

    if (len > 1) {
        var newArgs = [C, P].concat( Array.prototype.slice.call(arguments, 1, len));
        SuperMap.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};

/**
 * Function: SuperMap.inherit
 *
 * Parameters:
 * C - {Object} the class that inherits
 * P - {Object} the superclass to inherit from
 *
 * In addition to the mandatory C and P parameters, an arbitrary number of
 * objects can be passed, which will extend C.
 */
SuperMap.inherit = function(C, P) {
   var F = function() {};
   F.prototype = P.prototype;
   C.prototype = new F;
   var i, l, o;
   for(i=2, l=arguments.length; i<l; i++) {
       o = arguments[i];
       if(typeof o === "function") {
           o = o.prototype;
       }
       SuperMap.Util.extend(C.prototype, o);
   }
};

/**
 * APIFunction: extend
 * 复制源对象的所有属性到目标对象上，源对象上的没有定义的属性在目标对象上也不会被设置。
 *
 * Parameters:
 * destination - {Object} 目标对象。
 * source - {Object} 源对象，其属性将被设置到目标对象上。
 * Returns:
 * {Object} 目标对象。
 */
SuperMap.Util = SuperMap.Util || {};
SuperMap.Util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
