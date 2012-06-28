/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * @requires SuperMap/Control.js
 * @requires SuperMap/Handler/Drag.js
 */

/**
 * Class: SuperMap.Control.DragPan
 * 该类可通过鼠标拖拽的方式平移地图。
 *
 * Inherits from:
 *  - <SuperMap.Control>
 */
SuperMap.Control.DragPan = SuperMap.Class(SuperMap.Control, {

    /** 
     * Property: type
     * {SuperMap.Control.TYPES}
     */
    type: SuperMap.Control.TYPE_TOOL,
    
    /**
     * Property: panned
     * {Boolean} The map moved.
     */
    panned: false,
    
    /**
     * Property: interval
     * {Integer} The number of milliseconds that should ellapse before
     *     panning the map again. Defaults to 1 millisecond. In most cases
     *     you won't want to change this value. For slow machines/devices
     *     larger values can be tried out.
     */
    interval: 1,
    
    /**
     * APIProperty: documentDrag
     * {Boolean} 当该属性为true，拖拽要素时，鼠标移动到地图可视区域外依然有效。默认为false。
     */
    documentDrag: false,

    /**
     * Property: kinetic
     * {SuperMap.Kinetic} The SuperMap.Kinetic object.
     */
    kinetic: null,

    /**
     * APIProperty: enableKinetic
     * {Boolean} 设置是否使用拖拽动画。默认为false，不使用动画。
     */
    enableKinetic: false,

    /**
     * APIProperty: kineticInterval
     * {Integer} 执行动画的间隔，默认为10，单位是毫秒。
     */
    kineticInterval: 10,

    /**
     * Method: draw
     * Creates a Drag handler, using <panMap> and
     * <panMapDone> as callbacks.
     */    
    draw: function() {
        if(this.enableKinetic) {
            var config = {interval: this.kineticInterval};
            if(typeof this.enableKinetic === "object") {
                config = SuperMap.Util.extend(config, this.enableKinetic);
            }
            this.kinetic = new SuperMap.Kinetic(config);
        }
        this.handler = new SuperMap.Handler.Drag(this, {
                "move": this.panMap,
                "done": this.panMapDone,
                "down": this.panMapStart
            }, {
                interval: this.interval,
                documentDrag: this.documentDrag
            }
        );
    },

    /**
     * Method: panMapStart
     */
    panMapStart: function() {
        if(this.kinetic) {
            this.kinetic.begin();
        }
    },

    /**
    * Method: panMap
    *
    * Parameters:
    * xy - {<SuperMap.Pixel>} Pixel of the mouse position
    */
    panMap: function(xy) {
        if(this.kinetic) {
            this.kinetic.update(xy);
        }
        this.panned = true;
        this.map.pan(
            this.handler.last.x - xy.x,
            this.handler.last.y - xy.y,
            {dragging: true, animate: false}
        );
    },
    
    /**
     * Method: panMapDone
     * Finish the panning operation.  Only call setCenter (through <panMap>)
     *     if the map has actually been moved.
     *
     * Parameters:
     * xy - {<SuperMap.Pixel>} Pixel of the mouse position
     */
    panMapDone: function(xy) {
        if(this.panned) {
            var res = null;
            if (this.kinetic) {
                res = this.kinetic.end(xy);
            }
            this.map.pan(
                this.handler.last.x - xy.x,
                this.handler.last.y - xy.y,
                {dragging: !!res, animate: false}
            );
            if (res) {
                var self = this;
                this.kinetic.move(res, function(x, y, end) {
                    self.map.pan(x, y, {dragging: !end, animate: false});
                });
            }
            this.panned = false;
        }
    },

    CLASS_NAME: "SuperMap.Control.DragPan"
});
