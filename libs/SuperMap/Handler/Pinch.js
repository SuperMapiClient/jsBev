/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Handler.js
 */

/**
 * Class: SuperMap.Handler.Pinch
 * 手势操作事件处理器，用来处理一系列与手势操作相关的浏览器事件。
 * 可以告知控件一个手势操作的开始、发生经过、结束。
 * 使用手势操作处理器的控件通常要构建对应"start"、"move"、"done"的回调，
 * 这些回调会分别在手势操作开始，每一次变化和手势操作完成时被分别调用。
 *
 * 使用<SuperMap.Handler.Pinch>构造函数可以创建一个新的实例。
 *
 * Inherits from:
 *  - <SuperMap.Handler>
 */
SuperMap.Handler.Pinch = SuperMap.Class(SuperMap.Handler, {

    /**
     * Property: started
     * {Boolean} When a touchstart event is received, we want to record it,
     *     but not set 'pinching' until the touchmove get started after
     *     starting.
     */
    started: false,

    /**
     * Property: stopDown
     * {Boolean} Stop propagation of touchstart events from getting to
     *     listeners on the same element. Default is false.
     */
    stopDown: false,

    /**
     * Property: pinching
     * {Boolean}
     */
    pinching: false,

    /**
     * Property: last
     * {Object} Object that store informations related to pinch last touch.
     */
    last: null,

    /**
     * Property: start
     * {Object} Object that store informations related to pinch touchstart.
     */
    start: null,

    /**
     * Constructor: SuperMap.Handler.Pinch
     * 构造函数，返回一个新的手势操作处理器实例。
     *
     * Parameters:
     * control - {<SuperMap.Control>} 构建事件处理器的控件，如果该事件处理器没有被控件使用，那么必须明确调用setMap方法给当前handler赋予一个有效值。
     * callbacks - {Object} 回调函数对象，包含了提供手势操作开始、变化、和结束时分别调用的函数。这些回调函数接收一个
     * 包含操作比例scale、手势距离distance以及当前触摸点坐标的信息对象作为参数。
     * options - {Object} 一个可选对象，其属性将会赋值到事件处理器对象上。
     */
    initialize: function(control, callbacks, options) {
        SuperMap.Handler.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: touchstart
     * Handle touchstart events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchstart: function(evt) {
        var propagate = true;
        this.pinching = false;
        if (SuperMap.Event.isMultiTouch(evt)) {
            this.started = true;
            this.last = this.start = {
                distance: this.getDistance(evt.touches),
                delta: 0,
                scale: 1
            };
            this.callback("start", [evt, this.start]);
            propagate = !this.stopDown;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        // prevent document dragging
        SuperMap.Event.stop(evt);
        return propagate;
    },

    /**
     * Method: touchmove
     * Handle touchmove events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchmove: function(evt) {
        if (this.started && SuperMap.Event.isMultiTouch(evt)) {
            this.pinching = true;
            var current = this.getPinchData(evt);
            this.callback("move", [evt, current]);
            this.last = current;
            // prevent document dragging
            SuperMap.Event.stop(evt);
        }
        return true;
    },

    /**
     * Method: touchend
     * Handle touchend events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchend: function(evt) {
        if (this.started) {
            this.started = false;
            this.pinching = false;
            this.callback("done", [evt, this.start, this.last]);
            this.start = null;
            this.last = null;
        }
        return true;
    },

    /**
     * Method: activate
     * Activate the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully activated.
     */
    activate: function() {
        var activated = false;
        if (SuperMap.Handler.prototype.activate.apply(this, arguments)) {
            this.pinching = false;
            activated = true;
        }
        return activated;
    },

    /**
     * Method: deactivate
     * Deactivate the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if (SuperMap.Handler.prototype.deactivate.apply(this, arguments)) {
            this.started = false;
            this.pinching = false;
            this.start = null;
            this.last = null;
            deactivated = true;
        }
        return deactivated;
    },

    /**
     * Method: getDistance
     * Get the distance in pixels between two touches.
     *
     * Parameters:
     * touches - {Array(Object)}
     *
     * Returns:
     * {Number} The distance in pixels.
     */
    getDistance: function(touches) {
        var t0 = touches[0];
        var t1 = touches[1];
        return Math.sqrt(
            Math.pow(t0.clientX - t1.clientX, 2) +
            Math.pow(t0.clientY - t1.clientY, 2)
        );
    },


    /**
     * Method: getPinchData
     * Get informations about the pinch event.
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Object} Object that contains data about the current pinch.
     */
    getPinchData: function(evt) {
        var distance = this.getDistance(evt.touches);
        var scale = distance / this.start.distance;
        return {
            distance: distance,
            delta: this.last.distance - distance,
            scale: scale
        };
    },

    CLASS_NAME: "SuperMap.Handler.Pinch"
});

