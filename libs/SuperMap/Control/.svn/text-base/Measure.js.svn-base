/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 * @requires SuperMap/Feature/Vector.js
 */

/**
 * Class: SuperMap.Control.Measure
 * 该类实现在地图上绘制要素，获取距离或面积的操作。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.Measure = SuperMap.Class(SuperMap.Control, {

    /**
     * Constant: EVENT_TYPES
     * {Array(String)} 支持的事件类型。通过下面的语法注册事件。
     * (code)
     * control.events.register(type, obj, listener);
     * (end)
     *
     *
     * 支持的事件类型：
     * measure - 当量算完成时触发。返回measure、units、order、geometry信息。
     * measurepartial - 当点被添加到量算过程中时触发。返回measure、units、order、geometry信息。
     */
    EVENT_TYPES: ['measure', 'measurepartial'],

    /**
     * APIProperty: handlerOptions
     * {Object} 设置非默认属性的值。
     */
    handlerOptions: null,
    
    /**
     * Property: callbacks
     * {Object} The functions that are sent to the handler for callback
     */
    callbacks: null,
    
    /**
     * Property: displaySystem
     * {String} Display system for output measurements.  Supported values
     *     are 'english', 'metric', and 'geographic'.  Default is 'metric'.
     */
    displaySystem: 'metric',
    
    /**
     * Property: geodesic
     * {Boolean} Calculate geodesic metrics instead of planar metrics.  This
     *     requires that geometries can be transformed into Geographic/WGS84
     *     (if that is not already the map projection).  Default is false.
     */
    geodesic: false,
    
    /**
     * Property: displaySystemUnits
     * {Object} Units for various measurement systems.  Values are arrays
     *     of unit abbreviations (from SuperMap.INCHES_PER_UNIT) in decreasing
     *     order of length.
     */
    displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },

    /**
     * Property: delay
     * {Number} Number of milliseconds between clicks before the event is
     *     considered a double-click.  The "measurepartial" event will not
     *     be triggered if the sketch is completed within this time.  This
     *     is required for IE where creating a browser reflow (if a listener
     *     is modifying the DOM by displaying the measurement values) messes
     *     with the dblclick listener in the sketch handler.
     */
    partialDelay: 300,

    /**
     * Property: delayedTrigger
     * {Number} Timeout id of trigger for measurepartial.
     */
    delayedTrigger: null,

    /**
     * APIProperty: persist
     * {Boolean} 是否在量算结束后保留绘制的要素。当新的量算开始，控件取消激活获取取消量算时会清楚绘制的要素。默认为：false，不保留。
     */
    persist: false,

    /**
     * APIProperty: immediate
     * {Boolean} 当该属性为true时，量算过程中时时显示结果，同时会触发 "measurepartial" 事件。默认为false。
     */
    immediate : false,

    /**
     * Constructor: SuperMap.Control.Measure
     * 
     * Parameters:
     * handler - {<SuperMap.Handler>} 量算时使用的绘图方法。
     * options - {Object} 设置该类支持的属性，当用户不使用默认值时，可通过此参数设置。
     */
    initialize: function(handler, options) {
        // concatenate events specific to measure with those from the base
        this.EVENT_TYPES =
            SuperMap.Control.Measure.prototype.EVENT_TYPES.concat(
            SuperMap.Control.prototype.EVENT_TYPES
        );
        SuperMap.Control.prototype.initialize.apply(this, [options]);
        var callbacks = {done: this.measureComplete,
            point: this.measurePartial};
        if (this.immediate){
            callbacks.modify = this.measureImmediate;
        }
        this.callbacks = SuperMap.Util.extend(callbacks, this.callbacks);

        // let the handler options override, so old code that passes 'persist' 
        // directly to the handler does not need an update
        this.handlerOptions = SuperMap.Util.extend(
            {persist: this.persist}, this.handlerOptions
        );
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },
    
    /**
     * APIMethod: deactivate
     * 取消激活该控件。
     */
    deactivate: function() {
        this.cancelDelay();
        return SuperMap.Control.prototype.deactivate.apply(this, arguments);
    },

    /**
     * APIMethod: cancel
     * 取消量算，绘制的要素也会被擦除。
     */
    cancel: function() {
        this.cancelDelay();
        this.handler.cancel();
    },

    /**
     * APIMethod: setImmediate
     * 调用该方法可以实现动态设置量算过程是否时时显示量算结果。
     */
    setImmediate: function(immediate) {
        this.immediate = immediate;
        if (this.immediate){
            this.callbacks.modify = this.measureImmediate;
        } else {
            delete this.callbacks.modify;
        }
    },
    
    /**
     * Method: updateHandler
     *
     * Parameters:
     * handler - {Function} One of the sketch handler constructors.
     * options - {Object} Options for the handler.
     */
    updateHandler: function(handler, options) {
        var active = this.active;
        if(active) {
            this.deactivate();
        }
        this.handler = new handler(this, this.callbacks, options);
        if(active) {
            this.activate();
        }
    },

    /**
     * Method: measureComplete
     * Called when the measurement sketch is done.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     */
    measureComplete: function(geometry) {
        this.cancelDelay();
        this.measure(geometry, "measure");
    },
    
    /**
     * Method: measurePartial
     * Called each time a new point is added to the measurement sketch.
     *
     * Parameters:
     * point - {<SuperMap.Geometry.Point>} The last point added.
     * geometry - {<SuperMap.Geometry>} The sketch geometry.
     */
    measurePartial: function(point, geometry) {
        this.cancelDelay();
        geometry = geometry.clone();
        // when we're wating for a dblclick, we have to trigger measurepartial
        // after some delay to deal with reflow issues in IE
        if (this.handler.freehandMode(this.handler.evt)) {
            // no dblclick in freehand mode
            this.measure(geometry, "measurepartial");
        } else {
            this.delayedTrigger = window.setTimeout(
                SuperMap.Function.bind(function() {
                    this.delayedTrigger = null;
                    this.measure(geometry, "measurepartial");
                }, this),
                this.partialDelay
            );
        }
    },

    /**
     * Method: measureImmediate
     * Called each time the measurement sketch is modified.
     * 
     * Parameters: point - {<SuperMap.Geometry.Point>} The point at the
     * mouseposition. feature - {<SuperMap.Feature.Vector>} The sketch feature.
     */
    measureImmediate : function(point, feature, drawing) {
        if (drawing && this.delayedTrigger === null &&
                                !this.handler.freehandMode(this.handler.evt)) {
            this.measure(feature.geometry, "measurepartial");
        }
    },

    /**
     * Method: cancelDelay
     * Cancels the delay measurement that measurePartial began.
     */
    cancelDelay: function() {
        if (this.delayedTrigger !== null) {
            window.clearTimeout(this.delayedTrigger);
            this.delayedTrigger = null;
        }
    },

    /**
     * Method: measure
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * eventType - {String}
     */
    measure: function(geometry, eventType) {
        var stat, order;
        if(geometry.CLASS_NAME.indexOf('LineString') > -1) {
            stat = this.getBestLength(geometry);
            order = 1;
        } else {
            stat = this.getBestArea(geometry);
            order = 2;
        }
        this.events.triggerEvent(eventType, {
            measure: stat[0],
            units: stat[1],
            order: order,
            geometry: geometry
        });
    },
    
    /**
     * Method: getBestArea
     * Based on the <displaySystem> returns the area of a geometry.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     *
     * Returns:
     * {Array([Float, String])}  Returns a two item array containing the
     *     area and the units abbreviation.
     */
    getBestArea: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit);
            if(area > 1) {
                break;
            }
        }
        return [area, unit];
    },
    
    /**
     * Method: getArea
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * units - {String} Unit abbreviation
     *
     * Returns:
     * {Float} The geometry area in the given units.
     */
    getArea: function(geometry, units) {
        var area, geomUnits;
        if(this.geodesic) {
            area = geometry.getGeodesicArea(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = SuperMap.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = SuperMap.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area;
    },
    
    /**
     * Method: getBestLength
     * Based on the <displaySystem> returns the length of a geometry.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     *
     * Returns:
     * {Array([Float, String])}  Returns a two item array containing the
     *     length and the units abbreviation.
     */
    getBestLength: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit);
            if(length > 1) {
                break;
            }
        }
        return [length, unit];
    },

    /**
     * Method: getLength
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * units - {String} Unit abbreviation
     *
     * Returns:
     * {Float} The geometry length in the given units.
     */
    getLength: function(geometry, units) {
        var length, geomUnits;
        if(this.geodesic) {
            length = geometry.getGeodesicLength(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = SuperMap.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = SuperMap.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length;
    },

    CLASS_NAME: "SuperMap.Control.Measure"
});
